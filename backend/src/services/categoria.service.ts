import { prisma } from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import {
  ActualizarCategoriaDTO,
  CrearCategoriaDTO,
} from "../types/categoria.types";

export const categoriaService = {
  // GET /categorias
  async listar() {
    return prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
      // _count nos permite saber cuántos productos tiene cada categoría
      // sin traer todos los productos completos (más eficiente).
      include: { _count: { select: { productos: true } } },
    });
  },

  // GET /categorias/:id
  async obtenerPorId(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: { productos: true }, // trae también sus productos relacionados
    });

    if (!categoria) {
      throw new AppError(`Categoría con id ${id} no encontrada`, 404);
    }
    return categoria;
  },

  // POST /categorias
  async crear(data: CrearCategoriaDTO) {
    const existente = await prisma.categoria.findUnique({
      where: { nombre: data.nombre },
    });
    if (existente) {
      throw new AppError(`Ya existe una categoría llamada "${data.nombre}"`, 409);
    }
    return prisma.categoria.create({ data });
  },

  // PUT /categorias/:id
  async actualizar(id: number, data: ActualizarCategoriaDTO) {
    await this.obtenerPorId(id); // valida que exista (o lanza 404)
    return prisma.categoria.update({ where: { id }, data });
  },

  // DELETE /categorias/:id
  async eliminar(id: number) {
    await this.obtenerPorId(id);

    const productosAsociados = await prisma.producto.count({
      where: { categoriaId: id },
    });
    if (productosAsociados > 0) {
      throw new AppError(
        "No se puede eliminar: la categoría tiene productos asociados",
        409
      );
    }

    await prisma.categoria.delete({ where: { id } });
    return { id };
  },
};
