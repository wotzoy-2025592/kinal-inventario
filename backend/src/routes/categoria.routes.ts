import { Router } from "express";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from "../controllers/categoria.controller";
import { verificarToken } from "../middlewares/auth";

const router = Router();

// Lectura pública (opcional: podrías protegerla también con verificarToken)
router.get("/", listarCategorias);
router.get("/:id", obtenerCategoria);

// Escritura protegida: solo un usuario con token válido puede modificar datos
router.post("/", verificarToken, crearCategoria);
router.put("/:id", verificarToken, actualizarCategoria);
router.delete("/:id", verificarToken, eliminarCategoria);

export default router;
