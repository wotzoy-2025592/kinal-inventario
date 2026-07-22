import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Producto } from "../../../core/models/producto.model";
import { MovimientoService } from "../../../core/services/movimiento.service";
import { ProductoService } from "../../../core/services/producto.service";

@Component({
  selector: "app-movimiento-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./movimiento-form.component.html",
  styleUrl: "./movimiento-form.component.css",
})
export class MovimientoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  cargando = false;
  errorMensaje = "";
  productos: Producto[] = [];

  formulario = this.fb.group({
    productoId: [null as number | null, [Validators.required]],
    tipo: ["ENTRADA", [Validators.required]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    motivo: [""],
  });

  get productoId() { return this.formulario.get("productoId")!; }
  get cantidad() { return this.formulario.get("cantidad")!; }

  ngOnInit(): void {
    this.productoService.listar().subscribe({
      next: (res) => (this.productos = res.data ?? []),
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const v = this.formulario.value;
    const datos = {
      productoId: Number(v.productoId),
      tipo: v.tipo as "ENTRADA" | "SALIDA",
      cantidad: Number(v.cantidad),
      motivo: v.motivo || undefined,
    };

    this.cargando = true;
    this.movimientoService.crear(datos).subscribe({
      next: () => this.router.navigate(["/movimientos"]),
      error: (err) => {
        this.cargando = false;
        this.errorMensaje = err.error?.mensaje || "No se pudo registrar el movimiento";
      },
    });
  }
}
