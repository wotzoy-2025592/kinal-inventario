import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { Producto, ProductoForm } from "../models/producto.model";

@Injectable({ providedIn: "root" })
export class ProductoService {
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(this.baseUrl);
  }

  obtener(id: number): Observable<ApiResponse<Producto>> {
    return this.http.get<ApiResponse<Producto>>(`${this.baseUrl}/${id}`);
  }

  crear(datos: ProductoForm): Observable<ApiResponse<Producto>> {
    return this.http.post<ApiResponse<Producto>>(this.baseUrl, datos);
  }

  actualizar(id: number, datos: Partial<ProductoForm>): Observable<ApiResponse<Producto>> {
    return this.http.put<ApiResponse<Producto>>(`${this.baseUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

  listarStockBajo(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<ApiResponse<Producto[]>>(`${this.baseUrl}/stock-bajo`);
  }
}
