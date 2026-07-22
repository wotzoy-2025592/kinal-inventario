// Unión de literales de tipo string: solo permite estos dos valores exactos.
export type TipoMovimiento = "ENTRADA" | "SALIDA";

export interface Movimiento {
  id: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo?: string;
  fecha: string;
  productoId: number;
  producto?: { id: number; nombre: string };
}

export type MovimientoForm = Omit<Movimiento, "id" | "fecha" | "producto">;
