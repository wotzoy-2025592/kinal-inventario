import { Request, Response } from "express";
import { catchAsync } from "../middlewares/errorHandler";
import { movimientoService } from "../services/movimiento.service";
import { crearMovimientoSchema } from "../types/movimiento.types";

export const listarMovimientos = catchAsync(async (_req: Request, res: Response) => {
  const movimientos = await movimientoService.listar();
  res.json({ ok: true, data: movimientos });
});

export const listarMovimientosPorProducto = catchAsync(
  async (req: Request, res: Response) => {
    const productoId = Number(req.params.productoId);
    const movimientos = await movimientoService.listarPorProducto(productoId);
    res.json({ ok: true, data: movimientos });
  }
);

export const crearMovimiento = catchAsync(async (req: Request, res: Response) => {
  const datos = crearMovimientoSchema.parse(req.body);
  const movimiento = await movimientoService.crear(datos);
  res.status(201).json({ ok: true, data: movimiento });
});
