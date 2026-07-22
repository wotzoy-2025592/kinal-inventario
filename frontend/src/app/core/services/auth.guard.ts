import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

// Guard funcional: Angular lo ejecuta ANTES de activar una ruta.
// Si devuelve false, la navegación se cancela.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  router.navigate(["/login"]);
  return false;
};
