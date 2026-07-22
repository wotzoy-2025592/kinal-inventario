import { z } from "zod";

// Esquema para CREAR una categoría: todos los campos requeridos que apliquen
export const crearCategoriaSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().max(255).optional(),
});

// Esquema para ACTUALIZAR: usamos .partial() (utility type de zod, análogo
// a Partial<T> de TypeScript) porque en un update el usuario puede enviar
// solo algunos campos.
export const actualizarCategoriaSchema = crearCategoriaSchema.partial();

// z.infer<> genera el tipo de TypeScript automáticamente a partir del
// esquema de zod, así no se duplica la definición.
export type CrearCategoriaDTO = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoriaDTO = z.infer<typeof actualizarCategoriaSchema>;
