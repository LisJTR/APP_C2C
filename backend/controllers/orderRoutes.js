import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router(); // Creamos un enrutador para definir endpoints relacionados con órdenes

// Endpoint para crear una nueva orden (compra)
// Requiere autenticación: el comprador debe estar logueado (authMiddleware valida el token JWT y extrae el ID del usuario)
router.post("/", authMiddleware, async (req, res) => {
  const { product_id, seller_id, total_price } = req.body;
  const buyer_id = req.user.id; // extraído del token JWT

  try {
    // Insertamos una nueva orden en la base de datos con estado 'pendiente' y fecha actual
    const result = await pool.query(
      `INSERT INTO orders (buyer_id, seller_id, product_id, total_price, status, created_at)
       VALUES ($1, $2, $3, $4, 'pendiente', NOW()) RETURNING *`,
      [buyer_id, seller_id, product_id, total_price]
    );
// Devolvemos la orden creada al cliente
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Si ocurre un error (por ejemplo, violaciones de integridad o error de conexión), se responde con un código 500
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ error: "No se pudo registrar la orden" });
  }
});

export default router; // Exportamos el router para poder integrarlo en la aplicación principal
