// backend/controllers/productRoutes.js
import express from "express";
import pool from "../config/db.js";

const router = express.Router();  // Creamos un enrutador de Express para definir las rutas relacionadas con producto

// Ruta GET para obtener productos visibles públicamente.
// Permite aplicar filtros por categoría y por término de búsqueda (query), y solo retorna productos no vendidos.
// También une cada producto con su primera imagen (si existe), ordenados por fecha de creación descendente.

router.get("/products", async (req, res) => {
  const { category, query } = req.query;

  try {
    // Construcción dinámica de condiciones para el WHERE en función de los filtros recibidos
    // Siempre mostramos solo productos no vendidos
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
// Consulta que obtiene todos los productos junto a su primera imagen (LEFT JOIN LATERAL),
    // lo que permite mostrar una vista previa por cada producto en la interfaz
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

// Ruta GET que devuelve una lista de títulos de productos como sugerencias,
// útil para mostrar autocompletado o resultados dinámicos en el buscador.
router.get("/products/suggestions", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json([]);
  }

  try {
    // Se obtienen hasta 10 títulos distintos que contengan el texto buscado
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

// Ruta GET que obtiene todos los detalles de un producto específico según su ID.
// También carga todas sus imágenes asociadas y las añade al objeto del producto.
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
// Se cargan todas las imágenes asociadas al producto para mostrar en un carrusel, galería, etc.
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

// Ruta POST para crear un nuevo producto en la base de datos.
// Permite subir múltiples imágenes asociadas y guarda la información básica del producto (categoría, talla, precio, etc.).
router.post("/products", async (req, res) => {
  const { user_id, title, description, price, category, size, condition, brand, images } = req.body;

  try {
    // Insertamos el producto principal en la tabla 'products' y marcamos como no vendido por defecto
    const productResult = await pool.query(
      `INSERT INTO products (user_id, title, description, price, category, size, condition, brand, is_sold, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW())
       RETURNING id`,
      [user_id, title, description, price, category, size, condition, brand]
    );

    const productId = productResult.rows[0].id;

    if (images && images.length > 0) {
       // Si se han enviado imágenes, se insertan en la tabla 'product_images' vinculadas al ID del producto
      const insertImagePromises = images.map((imageUrl) => {
        return pool.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
          [productId, imageUrl]
        );
      });

      await Promise.all(insertImagePromises); // Ejecutamos todas las inserciones de forma concurrente
    }

    res.status(201).json({ message: "Producto creado correctamente", productId });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});
export default router; // Exportamos el router para ser utilizado en la app principal
