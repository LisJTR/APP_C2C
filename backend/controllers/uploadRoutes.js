// backend/controllers/uploadRoutes.js

// Este controlador define la lógica para subir archivos de imagen al servidor usando multer,
// una librería que facilita la gestión de archivos en peticiones multipart/form-data.

import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Estas líneas permiten obtener correctamente la ruta del archivo actual (__filename y __dirname)
// cuando se usa ESModules (import/export), ya que no están definidos por defecto como en CommonJS.
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer
// Configuramos multer para guardar archivos en disco.
// Se define tanto la carpeta de destino como el formato del nombre del archivo, que será único
// (usando la marca de tiempo y el nombre original del archivo).
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Carpeta donde se almacenarán los archivos subidos
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;  // Evita colisiones de nombres
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }); // Creamos una instancia de multer con esta configuración

// Ruta POST /api/upload
// Ruta POST que recibe una imagen (campo "image") y la guarda en el servidor.
// Si se sube correctamente, se devuelve la URL relativa de acceso a la imagen.
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se proporcionó ningún archivo" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Ruta donde se podrá acceder a la imagen desde el frontend
  res.json({ message: "Imagen subida exitosamente", imageUrl });
});

export default router; // Exportamos el router para integrarlo en la aplicación principal
