import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: "app-root",
  standalone: true, // componente standalone: no necesita declararse en un @NgModule
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  cerrarSesion(): void {
    this.authService.logout();
    window.location.href = "/productos";
  }
}
