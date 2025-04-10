// backend/controllers/productRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  const { category, query } = req.query;

  try {
    const baseQuery = `
      SELECT * FROM products
      WHERE is_sold = false
      ${category ? "AND category = $1" : ""}
      ${query ? `AND (title ILIKE $2 OR description ILIKE $2)` : ""}
      ORDER BY created_at DESC
    `;

    let values = [];

    if (category && query) {
      values = [category, `%${query}%`];
    } else if (category) {
      values = [category];
    } else if (query) {
      values = [`%${query}%`];
    }

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
});

export default router;
