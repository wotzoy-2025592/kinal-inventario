import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { catchAsync, AppError } from "../middlewares/errorHandler";

// zod define un "esquema" y valida en tiempo de EJECUCIÓN la forma del
// body que llega en la petición (TypeScript solo valida en tiempo de
// compilación, por eso necesitamos algo como zod para datos externos).
const loginSchema = z.object({
  correo: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const datos = loginSchema.parse(req.body); // lanza si no cumple el esquema

  const correoValido = datos.correo === process.env.ADMIN_EMAIL;
  const passwordValida =
    correoValido &&
    bcrypt.compareSync(datos.password, process.env.ADMIN_PASSWORD_HASH as string);

  if (!passwordValida) {
    throw new AppError("Credenciales incorrectas", 401);
  }

  const token = jwt.sign(
    { correo: datos.correo, rol: "admin" },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" } as jwt.SignOptions
  );

  res.json({
    ok: true,
    mensaje: "Inicio de sesión exitoso",
    data: {
      token,
    },
  });
});
