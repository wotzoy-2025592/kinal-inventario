// Importante: esta línea DEBE ser la primera de todo el archivo.
// zone.js "parcha" funciones globales como setTimeout, Promise y XMLHttpRequest
// para que Angular se entere cuándo terminó algo asíncrono (como una petición HTTP)
// y así actualice la pantalla automáticamente. Si algo más se carga antes,
// Angular puede quedarse sin saber que los datos ya llegaron.
import "zone.js";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
