import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Movimiento } from "../../../core/models/movimiento.model";
import { AuthService } from "../../../core/services/auth.service";
import { MovimientoService } from "../../../core/services/movimiento.service";

@Component({
  selector: "app-movimiento-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./movimiento-list.component.html",
  styleUrl: "./movimiento-list.component.css",
})
export class MovimientoListComponent implements OnInit {
  movimientos: Movimiento[] = [];
  cargando = true;
  errorMensaje = "";

  constructor(
    private movimientoService: MovimientoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.movimientoService.listar().subscribe({
      next: (res) => {
        this.movimientos = res.data ?? [];
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = "No se pudieron cargar los movimientos";
        this.cargando = false;
      },
    });
  }
}
