// server.js (versión ES Modules)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

//  IMPORTAR RUTAS (¡debes usar extensión .js!)
import authRoutes from "./controllers/authRoutes.js";
import userRoutes from "./controllers/userRoutes.js";
import productRoutes from "./controllers/productRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./controllers/uploadRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
  console.log(`➡️ Petición recibida: ${req.method} ${req.originalUrl}`);
  next();
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", productRoutes);
app.use("/api", uploadRoutes);


// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", productRoutes); 

// Iniciar servidor
app.listen(5000, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});



