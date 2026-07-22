// Interfaz GENÉRICA (Generics de TypeScript): <T> es un "comodín" que se
// reemplaza por el tipo real al usarla, ej: ApiResponse<Categoria[]>
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  mensaje?: string;
}
