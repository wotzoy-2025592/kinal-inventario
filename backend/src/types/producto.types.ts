import { z } from "zod";

export const crearProductoSchema = z.object({
  nombre: z.string().min(2).max(150),
  descripcion: z.string().max(255).optional(),
  precio: z.number().positive("El precio debe ser mayor a 0"),
  stock: z.number().int().nonnegative().default(0),
  stockMinimo: z.number().int().nonnegative().default(5),
  categoriaId: z.number().int().positive("Debes indicar una categoría válida"),
});

export const actualizarProductoSchema = crearProductoSchema.partial();

export type CrearProductoDTO = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoDTO = z.infer<typeof actualizarProductoSchema>;
