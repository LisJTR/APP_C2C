// backend/controllers/userRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const validateUpdate = [
  body("username").optional().notEmpty().withMessage("El nombre de usuario no puede estar vacío"),
  body("email").optional().isEmail().withMessage("Debe proporcionar un email válido"),
];

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT 
         u.id, u.username, u.email, u.location, u.bio, u.avatar_url, u.is_verified, u.created_at, 
         u.country_id, c.name AS country_name
       FROM users u
       LEFT JOIN countries c ON u.country_id = c.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil obtenido con éxito", user: user.rows[0] });
  } catch (error) {
    console.error("Error en la ruta de perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.put("/update", authMiddleware, validateUpdate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, location, bio, avatar_url, country_id } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("🧠 Avatar URL recibido:", avatar_url?.substring(0, 100));

    const updatedUser = await pool.query(
      `UPDATE users 
       SET 
         username = COALESCE($1, username), 
         email = COALESCE($2, email), 
         location = COALESCE($3, location), 
         bio = COALESCE($4, bio), 
         avatar_url = COALESCE($5, avatar_url),
         country_id = COALESCE($6, country_id)
       WHERE id = $7 
       RETURNING id, username, email, location, bio, avatar_url, is_verified, created_at, country_id`,
      [username || null, email || null, location || null, bio || null, avatar_url || null, country_id || null, req.user.id]
    );

    res.json({ message: "Perfil actualizado", user: updatedUser.rows[0] });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

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

router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, username, email FROM users 
       WHERE is_verified = true AND username ILIKE $1`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error al buscar usuarios:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/suggestions", async (req, res) => {
  const query = req.query.query?.toLowerCase();
  if (!query) return res.json([]);

  try {
    const result = await pool.query(
      `SELECT username FROM users WHERE LOWER(username) LIKE $1 AND is_verified = true LIMIT 5`,
      [`%${query}%`]
    );

    res.json(result.rows.map(r => r.username));
  } catch (err) {
    console.error("Error al obtener sugerencias:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});
// ✅ Ruta pública para obtener un usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, username, email, location, bio, avatar_url FROM users WHERE id = $1',[id]);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error interno al obtener usuario' });
  }
});

// Obtener productos publicados por un usuario
router.get("/:id/products", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT p.*, pi.image_url FROM products p LEFT JOIN LATERAL (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY id ASC LIMIT 1) pi ON true WHERE user_id = $1",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos del usuario:", error);
    res.status(500).json({ error: "Error al obtener productos del usuario" });
  }
});
// Obtener ciudades por país
router.get("/cities/:countryId", async (req, res) => {
  const { countryId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, name FROM cities WHERE country_id = $1 ORDER BY name ASC",
      [countryId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    res.status(500).json({ message: "Error al obtener ciudades" });
  }
});
export default router;