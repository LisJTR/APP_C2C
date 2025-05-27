import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Crear nueva orden
router.post("/", authMiddleware, async (req, res) => {
  const { product_id, seller_id, total_price } = req.body;
  const buyer_id = req.user.id; // extraído del token JWT

  try {
    const result = await pool.query(
      `INSERT INTO orders (buyer_id, seller_id, product_id, total_price, status, created_at)
       VALUES ($1, $2, $3, $4, 'pendiente', NOW()) RETURNING *`,
      [buyer_id, seller_id, product_id, total_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ error: "No se pudo registrar la orden" });
  }
});

export default router;
