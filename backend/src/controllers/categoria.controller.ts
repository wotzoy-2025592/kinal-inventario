import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { categoriaService } from "../services/categoria.service";
import {
  actualizarCategoriaSchema,
  crearCategoriaSchema,
} from "../types/categoria.types";

export const listarCategorias = catchAsync(async (_req: Request, res: Response) => {
  const categorias = await categoriaService.listar();
  res.json({ ok: true, data: categorias });
});

export const obtenerCategoria = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const categoria = await categoriaService.obtenerPorId(id);
  res.json({ ok: true, data: categoria });
});

export const crearCategoria = catchAsync(async (req: Request, res: Response) => {
  const datos = crearCategoriaSchema.parse(req.body);
  const categoria = await categoriaService.crear(datos);
  res.status(201).json({ ok: true, data: categoria });
});

export const actualizarCategoria = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const datos = actualizarCategoriaSchema.parse(req.body);
  const categoria = await categoriaService.actualizar(id, datos);
  res.json({ ok: true, data: categoria });
});

export const eliminarCategoria = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await categoriaService.eliminar(id);
  res.json({ ok: true, mensaje: "Categoría eliminada correctamente" });
});
