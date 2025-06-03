import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import axios from "axios";
import { sendVerificationEmail } from "../utils/emailService.js";
import crypto from "crypto";
import authMiddleware from "../middlewares/authMiddleware.js";

 // Crear un nuevo enrutador
const router = express.Router();
const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // Ej: "3F6A9B"
// Genera un código aleatorio de verificación de 6 caracteres hexadecimales (ej: "3F6A9B")

// Ruta POST para registrar un nuevo usuario
// Registro
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("El nombre de usuario es obligatorio"),
    body("email").isEmail().withMessage("Debe proporcionar un email válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
     // Comprobamos si las validaciones han fallado
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
// Desestructuramos los datos enviados en el cuerpo
    const { username, email, password, location, bio, country_id } = req.body;

    try {
      // Verificamos si el correo ya está registrado
      const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya está registrado" });
      }
 // Encriptamos la contraseña
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
// Insertamos el nuevo usuario en la base de datos
      const newUser = await pool.query(
  `INSERT INTO users (username, email, password, verification_code, location, bio, country_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING id, username, email, location, bio, country_id`,
  [username, email, hashedPassword, verificationCode, location || null, bio || null, country_id || null]
);      

       // Enviamos correo de verificación con el código generado
    await sendVerificationEmail(email, verificationCode);

      res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser.rows[0] });
    } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// Ruta POST para iniciar sesión
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
     // Buscar usuario por email o username
    console.log("🟡 Intento login:", identifier, password);

    const user = await pool.query(
      "SELECT id, username, email, password, avatar_url, location, bio, created_at, balance FROM users WHERE email = $1 OR username = $1",
       [identifier]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email, usuario o contraseña incorrectos" });
    }
 // Comparamos contraseñas con bcrypt
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log("🔑 ¿Contraseña válida?:", validPassword);
    if (!validPassword) {
      return res.status(400).json({ message: "Email, usuario o contraseña incorrectos" });
    }
// Generamos token JWT válido por 1 hora
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   // Enviamos token + datos del usuario
    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        avatar_url: user.rows[0].avatar_url,
        location: user.rows[0].location,
        bio: user.rows[0].bio,
        created_at: user.rows[0].created_at,
        balance: user.rows[0].balance,
      }
      
    });
    console.log("🧪 Resultado de búsqueda:", user.rows);

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
  

});

// Ruta POST para login con Google OAuth2
router.post("/google", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Falta el token de Google" });
  }

  try {
    // Obtener datos del usuario desde Google
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const googleUser = googleRes.data;

    const email = googleUser.email;
    const username = googleUser.name || email.split("@")[0];

    // Verificar si ya existe en tu base de datos
    const userResult = await pool.query(
      "SELECT id, username, email FROM users WHERE email = $1", [email]);

    let user;

    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
    } else {
      // Si no existe, lo creamos sin contraseña (autenticado por Google)
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, email, null] // contraseña null
      );
      user = newUser.rows[0];
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Inicio de sesión con Google exitoso",
      token,
      user,
    });

  } catch (error) {
    console.error("❌ Error verificando token de Google:", error.message);
    res.status(401).json({ message: "Token de Google inválido" });
  }
});

// Ruta POST para verificar código de verificación recibido por email
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const result = await pool.query(
      "SELECT verification_code FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (result.rows[0].verification_code !== code.toUpperCase()) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // Podrías actualizar un campo "is_verified" si lo tienes
    await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [email]);

const userResult = await pool.query(
  `SELECT id, username, email FROM users WHERE email = $1`,
  [email]
);

const user = userResult.rows[0];

const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.json({
  message: "Código verificado correctamente",
  token,
  user,
});

  } catch (error) {
    console.error("Error verificando código:", error);
    res.status(500).json({ message: "Error en la verificación" });
  }
});

// Ruta POST para reenviar el código de verificación por email
router.post("/resend-code", async (req, res) => {
  const { email } = req.body;

   // Validamos formato del correo
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    // Generar nuevo código
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Verificar si el usuario existe
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "No se encontró un usuario con ese correo" });
    }

      // Guardar el nuevo código en la base de datos
    await pool.query("UPDATE users SET verification_code = $1 WHERE email = $2", [code, email]);

    await sendVerificationEmail(email, code);

    res.json({ message: "Código reenviado correctamente" });
  } catch (err) {
    console.error("❌ Error al reenviar código:", err);
    res.status(500).json({ message: "Error al reenviar el código" });
  }
});

export default router;  // Se exporta para ser usado desde app.js o server.js
