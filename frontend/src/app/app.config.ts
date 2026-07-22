import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { authInterceptor } from "./core/services/auth.interceptor";

// Angular moderno (standalone): en vez de un AppModule con @NgModule,
// la app se configura con "providers" que se registran aquí y se
// pasan a bootstrapApplication() en main.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
