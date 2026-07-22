import { NextFunction, Request, Response } from "express";

// Clase de error personalizada: nos permite lanzar errores con un
// código HTTP específico desde cualquier controlador.
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de errores de Express: SIEMPRE recibe 4 parámetros
// (err, req, res, next). Express lo detecta por esa firma y lo ejecuta
// cuando algo llama a next(error) o se lanza una excepción en una ruta
// async envuelta en catchAsync.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      mensaje: err.message,
    });
  }

  // Error no controlado (bug, fallo de conexión a BD, etc.)
  return res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor",
  });
}

// Helper para no repetir try/catch en cada controlador async.
// Envuelve la función y si esta rechaza (throw dentro de un async),
// automáticamente llama a next(error), que termina en errorHandler.
export function catchAsync(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
