import { Categoria } from "./categoria.model";

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
  categoria?: Categoria;
}

export type ProductoForm = Omit<Producto, "id" | "categoria">;
