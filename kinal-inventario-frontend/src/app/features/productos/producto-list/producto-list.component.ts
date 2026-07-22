import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
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
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);

  productos: Producto[] = [];
  cargando = true;
  errorMensaje = "";

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    console.log("1. Empezando a cargar productos...");
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (res) => {
        this.productos = res.data ?? [];
        this.cargando = false;        
        // Forzamos manualmente a Angular a repintar la vista con los datos
        // actuales del componente, sin depender de que zone.js lo detecte solo.
        this.cdr.detectChanges();        
      },
      error: (err) => {
        console.log("ERROR recibido:", err);
        this.errorMensaje = "No se pudieron cargar los productos";
        this.cargando = false;
        this.cdr.detectChanges();
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
