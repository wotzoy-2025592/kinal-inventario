import "dotenv/config"; // carga las variables de .env a process.env
import cors from "cors";
import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import categoriaRoutes from "./routes/categoria.routes";
import movimientoRoutes from "./routes/movimiento.routes";
import productoRoutes from "./routes/producto.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---
app.use(cors()); // permite que Angular (otro puerto/origen) consuma la API
app.use(express.json()); // parsea el body de las peticiones como JSON

// --- Ruta de salud (útil para probar que el server está vivo) ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, mensaje: "API Kinal Inventario funcionando" });
});

// --- Registro de rutas de cada módulo (CRUD en JSON) ---
app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/movimientos", movimientoRoutes);

// --- Middleware de errores: SIEMPRE al final, después de las rutas ---
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
