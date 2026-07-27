import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {

  claseFondo = "fondo-lista";

  constructor(
    public authService: AuthService,
    private router: Router
  ) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarFondo());

    this.actualizarFondo();
  }

  private actualizarFondo(): void {

    const url = this.router.url;

    if (url.includes("/login")) {
      this.claseFondo = "fondo-login";
    }

    else if (
      url.includes("/nuevo") ||
      url.includes("/editar")
    ) {
      this.claseFondo = "fondo-formulario";
    }

    else {
      this.claseFondo = "fondo-lista";
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    window.location.href = "/productos";
  }

}