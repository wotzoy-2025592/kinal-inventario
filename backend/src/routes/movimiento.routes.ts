import { Router } from "express";
import {
  crearMovimiento,
  listarMovimientos,
  listarMovimientosPorProducto,
} from "../controllers/movimiento.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

router.get("/", listarMovimientos);
router.get("/producto/:productoId", listarMovimientosPorProducto);
router.post("/", verificarToken, crearMovimiento);

export default router;
