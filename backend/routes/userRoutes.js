import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Middleware para proteger rutas

const router = express.Router();

// 🛠 Middleware de validación para actualizar perfil
const validateUpdate = [
  body("username").optional().notEmpty().withMessage("El nombre de usuario no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Debe proporcionar un email válido"),
];

// 🔹 Ruta protegida: Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [req.user.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil obtenido con éxito", user: user.rows[0] });
  } catch (error) {
    console.error("Error en la ruta de perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// 🔹 Ruta protegida: Actualizar perfil del usuario autenticado
router.put("/update", authMiddleware, validateUpdate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id = $3 RETURNING id, username, email",
      [username || null, email || null, req.user.id]
    );

    res.json({ message: "Perfil actualizado", user: updatedUser.rows[0] });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

  // 🔹 Eliminar usuario autenticado
  router.delete("/delete", authMiddleware, async (req, res) => {
    try {
      const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
  
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  export default router;
