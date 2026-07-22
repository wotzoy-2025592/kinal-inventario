import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { Categoria } from "../../../core/models/categoria.model";
import { CategoriaService } from "../../../core/services/categoria.service";
import { ProductoService } from "../../../core/services/producto.service";

@Component({
  selector: "app-producto-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./producto-form.component.html",
  styleUrl: "./producto-form.component.css",
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  modoEdicion = false;
  productoId?: number;
  cargando = false;
  errorMensaje = "";
  categorias: Categoria[] = [];

  formulario = this.fb.group({
    nombre: ["", [Validators.required, Validators.minLength(2)]],
    descripcion: [""],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [5, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null, [Validators.required]],
  });

  get nombre() { return this.formulario.get("nombre")!; }
  get precio() { return this.formulario.get("precio")!; }
  get stock() { return this.formulario.get("stock")!; }
  get categoriaId() { return this.formulario.get("categoriaId")!; }

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (res) => (this.categorias = res.data ?? []),
    });

    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.modoEdicion = true;
      this.productoId = Number(idParam);
      this.cargarProducto(this.productoId);
    }
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.productoService.obtener(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.formulario.patchValue({
            nombre: res.data.nombre,
            descripcion: res.data.descripcion,
            precio: Number(res.data.precio),
            stock: res.data.stock,
            stockMinimo: res.data.stockMinimo,
            categoriaId: res.data.categoriaId,
          });
        }
        this.cargando = false;
      },
      error: () => {
        this.errorMensaje = "No se pudo cargar el producto";
        this.cargando = false;
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.value;
    const datos = {
      nombre: v.nombre!,
      descripcion: v.descripcion || undefined,
      precio: Number(v.precio),
      stock: Number(v.stock),
      stockMinimo: Number(v.stockMinimo),
      categoriaId: Number(v.categoriaId),
    };

    const peticion = this.modoEdicion
      ? this.productoService.actualizar(this.productoId!, datos)
      : this.productoService.crear(datos);

    this.cargando = true;
    peticion.subscribe({
      next: () => this.router.navigate(["/productos"]),
      error: (err) => {
        this.cargando = false;
        this.errorMensaje = err.error?.mensaje || "No se pudo guardar el producto";
      },
    });
  }
}
