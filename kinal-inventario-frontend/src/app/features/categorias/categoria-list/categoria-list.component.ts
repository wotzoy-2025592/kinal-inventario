import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Categoria } from "../../../core/models/categoria.model";
import { AuthService } from "../../../core/services/auth.service";
import { CategoriaService } from "../../../core/services/categoria.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-prueba-12345",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./categoria-list.component.html",
  styleUrl: "./categoria-list.component.css",
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  cargando = true;
  errorMensaje = "";

  constructor(
    private categoriaService: CategoriaService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  )  {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {

    this.cargando = true;

    this.categoriaService.listar().subscribe({
      next: (res) => {
        this.categorias = res.data ?? [];
        this.cargando = false;

        this.cdr.detectChanges();

      },

      error: (err) => {
        console.log(">>> ERROR");
        console.error(err);

        this.errorMensaje = "No se pudieron cargar las categorías";
        this.cargando = false;
      },

      complete: () => {
      },
    });
  }

  eliminar(categoria: Categoria): void {
    const confirmado = confirm(`¿Eliminar la categoría "${categoria.nombre}"?`);
    if (!confirmado) return;

    this.categoriaService.eliminar(categoria.id).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.mensaje || "No se pudo eliminar"),
    });
  }
}