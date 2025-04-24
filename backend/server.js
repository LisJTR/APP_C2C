// server.js (versión ES Modules)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

//  IMPORTAR RUTAS (¡debes usar extensión .js!)
import authRoutes from "./controllers/authRoutes.js";
import userRoutes from "./controllers/userRoutes.js";
import productRoutes from "./controllers/productRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", productRoutes);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", productRoutes); 

// Iniciar servidor
app.listen(5000, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log("✅ Servidor corriendo en http://localhost:" + PORT);
});

