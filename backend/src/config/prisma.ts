// Creamos UNA sola instancia de PrismaClient y la reutilizamos en toda
// la app. Crear una instancia por cada archivo agotaría las conexiones
// a la base de datos.
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  // Descomenta la siguiente línea si quieres ver en consola cada SQL generado:
  // log: ["query", "info", "warn", "error"],
});
