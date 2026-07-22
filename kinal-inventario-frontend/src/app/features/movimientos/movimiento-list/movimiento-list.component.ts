import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Movimiento } from "../../../core/models/movimiento.model";
import { AuthService } from "../../../core/services/auth.service";
import { MovimientoService } from "../../../core/services/movimiento.service";
import { ChangeDetectorRef } from "@angular/core";

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
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.movimientoService.listar().subscribe({
      next: (res) => {
      this.movimientos = res.data ?? [];
      this.cargando = false;
      this.cdr.detectChanges();
    },
      error: () => {
        this.errorMensaje = "No se pudieron cargar los movimientos";
        this.cargando = false;
      },
    });
  }
}
