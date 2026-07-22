import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Producto } from "../../../core/models/producto.model";
import { AuthService } from "../../../core/services/auth.service";
import { ProductoService } from "../../../core/services/producto.service";

@Component({
  selector: "app-producto-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./producto-list.component.html",
  styleUrl: "./producto-list.component.css",
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  cargando = true;
  errorMensaje = "";

  constructor(
    private productoService: ProductoService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (res) => {
        this.productos = res.data ?? [];
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = "No se pudieron cargar los productos";
        this.cargando = false;
      },
    });
  }

  // Se usa en el template para pintar en rojo el stock bajo (property binding con [ngClass])
  tieneStockBajo(producto: Producto): boolean {
    return producto.stock <= producto.stockMinimo;
  }

  eliminar(producto: Producto): void {
    const confirmado = confirm(`¿Eliminar el producto "${producto.nombre}"?`);
    if (!confirmado) return;

    this.productoService.eliminar(producto.id).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.mensaje || "No se pudo eliminar"),
    });
  }
}
