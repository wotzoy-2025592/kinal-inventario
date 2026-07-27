import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiResponse } from "../models/api-response.model";

interface LoginResponse {
  token: string;
}

// @Injectable({ providedIn: 'root' }) registra el servicio en el
// "inyector raíz" de Angular: una sola instancia (singleton) para
// toda la aplicación, disponible en cualquier componente sin
// declararlo en un módulo manualmente.
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly TOKEN_KEY = "kinal_token";

  constructor(private http: HttpClient) {}

  login(correo: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/auth/login`, {
        correo,
        password,
      })
      .pipe(
        // tap() ejecuta un efecto secundario (guardar el token) sin
        // modificar el valor que sigue fluyendo por el observable.
        tap((res) => {
  console.log("RESPUESTA DEL LOGIN:", res);

  if (res.data?.token) {
    localStorage.setItem(this.TOKEN_KEY, res.data.token);
    console.log("TOKEN GUARDADO");
  } else {
    console.log("NO EXISTE TOKEN");
  }
})
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
}
