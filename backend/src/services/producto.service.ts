import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import {
  ActualizarProductoDTO,
  CrearProductoDTO,
} from "../types/producto.types";

export const productoService = {
  // GET /productos  (incluye el nombre de su categoría)
  async listar() {
    return prisma.producto.findMany({
      orderBy: { nombre: "asc" },
      include: { categoria: { select: { id: true, nombre: true } } },
    });
  },

  async obtenerPorId(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!producto) {
      throw new AppError(`Producto con id ${id} no encontrado`, 404);
    }
    return producto;
  },

  async crear(data: CrearProductoDTO) {
    const categoria = await prisma.categoria.findUnique({
      where: { id: data.categoriaId },
    });
    if (!categoria) {
      throw new AppError(`La categoría ${data.categoriaId} no existe`, 400);
    }
    return prisma.producto.create({ data });
  },

  async actualizar(id: number, data: ActualizarProductoDTO) {
    await this.obtenerPorId(id);

    if (data.categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: data.categoriaId },
      });
      if (!categoria) {
        throw new AppError(`La categoría ${data.categoriaId} no existe`, 400);
      }
    }

    return prisma.producto.update({ where: { id }, data });
  },

  async eliminar(id: number) {
    await this.obtenerPorId(id);

    const movimientos = await prisma.movimiento.count({
      where: { productoId: id },
    });
    if (movimientos > 0) {
      throw new AppError(
        "No se puede eliminar: el producto tiene movimientos registrados",
        409
      );
    }

    await prisma.producto.delete({ where: { id } });
    return { id };
  },

  // Bonus: productos por debajo del stock mínimo (para el dashboard)
  async listarConStockBajo() {
    return prisma.$queryRaw`
      SELECT id, nombre, stock, "stockMinimo"
      FROM productos
      WHERE stock <= "stockMinimo"
      ORDER BY stock ASC
    `;
  },
};
