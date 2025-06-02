// backend/controllers/productRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();

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
// Obtener un producto específico por ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Consulta del producto (sin image_url)
    const productResult = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const product = productResult.rows[0];

    // Consulta de todas las imágenes asociadas
    const imagesResult = await pool.query(
      `SELECT image_url FROM product_images WHERE product_id = $1 ORDER BY id ASC`,
      [id]
    );

    const images = imagesResult.rows.map(row => row.image_url);

    // Adjuntar imágenes al objeto del producto
    product.images = images;

    // Para compatibilidad: también asignamos la primera imagen como image_url
    product.image_url = images[0] || null;

    res.json(product);
  } catch (error) {
    console.error("❌ Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno al obtener producto" });
  }
});

// POST /api/products - subir nuevo producto
router.post("/products", async (req, res) => {
  const { user_id, title, description, price, category, images } = req.body;

  if (!user_id || !title || !description || !price || !category || !images?.length) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (user_id, title, description, price, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, description, price, category]
    );

    const productId = result.rows[0].id;

    for (const imageUrl of images) {
      await pool.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
        [productId, imageUrl]
      );
    }

    res.status(201).json({ message: "Producto subido con éxito", product: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al subir producto:", error);
    res.status(500).json({ error: "Error interno al subir producto" });
  }
});

export default router;
