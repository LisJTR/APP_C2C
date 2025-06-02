// backend/controllers/productRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET: obtener lista de productos
router.get("/products", async (req, res) => {
  const { category, query } = req.query;

  try {
    const conditions = ["is_sold = false"];
    const values = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      values.push(category);
    }

    if (query) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR brand ILIKE $${paramIndex})`);
      values.push(`%${query}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT p.*, pi.image_url
      FROM products p
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY id ASC
        LIMIT 1
      ) pi ON true
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error interno al obtener productos" });
    }
  }
});

// GET: obtener sugerencias
router.get("/products/suggestions", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json([]);
  }

  try {
    const result = await pool.query(
      `SELECT DISTINCT title FROM products WHERE title ILIKE $1 LIMIT 10`,
      [`%${query}%`]
    );
    const suggestions = result.rows.map((row) => row.title);
    res.json(suggestions);
  } catch (error) {
    console.error("❌ Error al obtener sugerencias:", error);
    res.status(500).json({ error: "Error interno al obtener sugerencias" });
  }
});

// GET: obtener producto por ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const product = productResult.rows[0];

    const imagesResult = await pool.query(
      `SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY id ASC`,
      [id]
    );

    const images = imagesResult.rows.map(row => row.image_url);
    product.images = images;
    product.image_url = images[0] || null;

    res.json(product);
  } catch (error) {
    console.error("❌ Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
});


// POST: crear producto con varias imágenes
router.post("/products", async (req, res) => {
  const { user_id, title, description, price, category, size, condition, brand, images } = req.body;

  try {
    const productResult = await pool.query(
      `INSERT INTO products (user_id, title, description, price, category, size, condition, brand, is_sold, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW())
       RETURNING id`,
      [user_id, title, description, price, category, size, condition, brand]
    );

    const productId = productResult.rows[0].id;

    if (images && images.length > 0) {
      const insertImagePromises = images.map((imageUrl) => {
        return pool.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
          [productId, imageUrl]
        );
      });

      await Promise.all(insertImagePromises);
    }

    res.status(201).json({ message: "Producto creado correctamente", productId });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

export default router;
