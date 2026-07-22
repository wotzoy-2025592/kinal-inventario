import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

// Extendemos el tipo Request de Express para poder guardar el usuario
// autenticado dentro de req.usuario en las siguientes rutas.
export interface RequestConUsuario extends Request {
  usuario?: { correo: string; rol: string };
}

export function verificarToken(
  req: RequestConUsuario,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization; // formato esperado: "Bearer <token>"

  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("No se proporcionó un token de acceso", 401);
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      correo: string;
      rol: string;
    };
    req.usuario = payload;
    next();
  } catch (error) {
    throw new AppError("Token inválido o expirado", 401);
  }
}
