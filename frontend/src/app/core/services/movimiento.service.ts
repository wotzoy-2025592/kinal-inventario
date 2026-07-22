import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { Movimiento, MovimientoForm } from "../models/movimiento.model";

@Injectable({ providedIn: "root" })
export class MovimientoService {
  private readonly baseUrl = `${environment.apiUrl}/movimientos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Movimiento[]>> {
    return this.http.get<ApiResponse<Movimiento[]>>(this.baseUrl);
  }

  listarPorProducto(productoId: number): Observable<ApiResponse<Movimiento[]>> {
    return this.http.get<ApiResponse<Movimiento[]>>(
      `${this.baseUrl}/producto/${productoId}`
    );
  }

  crear(datos: MovimientoForm): Observable<ApiResponse<Movimiento>> {
    return this.http.post<ApiResponse<Movimiento>>(this.baseUrl, datos);
  }
}
