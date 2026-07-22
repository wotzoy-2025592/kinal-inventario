import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";
import { Categoria, CategoriaForm } from "../models/categoria.model";

@Injectable({ providedIn: "root" })
export class CategoriaService {
  private readonly baseUrl = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Categoria[]>> {
    return this.http.get<ApiResponse<Categoria[]>>(this.baseUrl);
  }

  obtener(id: number): Observable<ApiResponse<Categoria>> {
    return this.http.get<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`);
  }

  crear(datos: CategoriaForm): Observable<ApiResponse<Categoria>> {
    return this.http.post<ApiResponse<Categoria>>(this.baseUrl, datos);
  }

  actualizar(id: number, datos: Partial<CategoriaForm>): Observable<ApiResponse<Categoria>> {
    return this.http.put<ApiResponse<Categoria>>(`${this.baseUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
