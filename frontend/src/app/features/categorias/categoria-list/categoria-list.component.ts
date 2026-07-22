import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Categoria } from "../../../core/models/categoria.model";
import { AuthService } from "../../../core/services/auth.service";
import { CategoriaService } from "../../../core/services/categoria.service";

@Component({
  selector: "app-categoria-list",
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
    public authService: AuthService
  ) {}

  // ngOnInit: hook del ciclo de vida que se ejecuta UNA vez, cuando
  // Angular ya inicializó los @Input y el componente está listo.
  // Aquí es el lugar correcto para pedir datos a una API.
  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.categoriaService.listar().subscribe({
      next: (res) => {
        this.categorias = res.data ?? [];
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = "No se pudieron cargar las categorías";
        this.cargando = false;
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
