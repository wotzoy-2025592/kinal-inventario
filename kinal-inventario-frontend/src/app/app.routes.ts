import { Routes } from "@angular/router";
import { authGuard } from "./core/services/auth.guard";

// loadComponent = LAZY LOADING: el código de cada componente solo se
// descarga cuando el usuario navega a esa ruta, no en la carga inicial.
export const routes: Routes = [
  { path: "", redirectTo: "productos", pathMatch: "full" },

  {
    path: "login",
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },

  {
    path: "categorias",
    loadComponent: () =>
      import("./features/categorias/categoria-list/categoria-list.component").then(
        (m) => m.CategoriaListComponent
      ),
  },
  {
    path: "categorias/nuevo",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/categorias/categoria-form/categoria-form.component").then(
        (m) => m.CategoriaFormComponent
      ),
  },
  {
    path: "categorias/editar/:id",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/categorias/categoria-form/categoria-form.component").then(
        (m) => m.CategoriaFormComponent
      ),
  },

  {
    path: "productos",
    loadComponent: () =>
      import("./features/productos/producto-list/producto-list.component").then(
        (m) => m.ProductoListComponent
      ),
  },
  {
    path: "productos/nuevo",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/productos/producto-form/producto-form.component").then(
        (m) => m.ProductoFormComponent
      ),
  },
  {
    path: "productos/editar/:id",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/productos/producto-form/producto-form.component").then(
        (m) => m.ProductoFormComponent
      ),
  },

  {
    path: "movimientos",
    loadComponent: () =>
      import("./features/movimientos/movimiento-list/movimiento-list.component").then(
        (m) => m.MovimientoListComponent
      ),
  },
  {
    path: "movimientos/nuevo",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/movimientos/movimiento-form/movimiento-form.component").then(
        (m) => m.MovimientoFormComponent
      ),
  },

  { path: "**", redirectTo: "productos" },
];
