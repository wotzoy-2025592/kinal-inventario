import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/login  { "correo": "...", "password": "..." }
router.post("/login", login);

export default router;
