import { Router } from "express";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProducto,
  productosStockBajo,
} from "../controllers/producto.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

router.get("/stock-bajo", productosStockBajo); // antes de "/:id" para que no choque la ruta
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

router.post("/", verificarToken, crearProducto);
router.put("/:id", verificarToken, actualizarProducto);
router.delete("/:id", verificarToken, eliminarProducto);

export default router;
