const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db");

const router = express.Router();

// Registro
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("El nombre de usuario es obligatorio"),
    body("email").isEmail().withMessage("Debe proporcionar un email válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "El usuario ya está registrado" });
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
        [username, email, hashedPassword]
      );

      res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser.rows[0] });
    } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
);

// Inicio de sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT id, username, email, password FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Email o contraseña incorrectos" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Ahora se devuelve el usuario en la respuesta
    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
      },
    });

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

const axios = require("axios");

// Login con Google
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
    const userResult = await pool.query("SELECT id, username, email FROM users WHERE email = $1", [email]);

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


module.exports = router;
