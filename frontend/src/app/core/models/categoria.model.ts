// Interfaces = "contratos" que describen la forma del JSON que devuelve la API.
// El operador "?" indica propiedad opcional.
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  creadoEn?: string;
  actualizadoEn?: string;
  _count?: { productos: number };
}

// Tipo "unión con Omit": para crear una categoría no enviamos id ni fechas,
// Omit<Tipo, 'campos'> quita esas propiedades del tipo original.
export type CategoriaForm = Omit<Categoria, "id" | "creadoEn" | "actualizadoEn" | "_count">;
