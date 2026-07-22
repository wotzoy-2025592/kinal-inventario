# 📦 Inventario de Bodega — Fundación Kinal

Proyecto de aprendizaje full-stack: **TypeScript + Node.js + Express + Prisma + PostgreSQL** (backend)
y **Angular** (frontend), para gestionar el inventario de una bodega con **3 tablas relacionales**:

```
Categoria (1) ───< Producto (1) ───< Movimiento
```

- Una **Categoría** agrupa varios **Productos** (Papelería, Limpieza, etc.)
- Un **Producto** tiene muchos **Movimientos** (entradas/salidas de bodega — kardex)
- Registrar un movimiento actualiza automáticamente el `stock` del producto

---

## 0. Estructura de software y de carpetas

```
kinal-inventario/
├── backend/                     # API REST (Node + TypeScript + Express + Prisma)
│   ├── src/
│   │   ├── config/prisma.ts     # Cliente Prisma (conexión a la BD)
│   │   ├── controllers/         # Reciben la petición HTTP y responden JSON
│   │   ├── routes/              # Definen los endpoints (/api/...)
│   │   ├── services/            # Lógica de negocio + acceso a datos
│   │   ├── middlewares/         # Auth (JWT) y manejo de errores
│   │   ├── types/               # Validación con Zod + tipos TypeScript
│   │   ├── scripts/             # Utilidades (generar hash de password)
│   │   └── index.ts             # Punto de entrada del servidor
│   ├── prisma/
│   │   ├── schema.prisma        # Modelo de datos (3 tablas)
│   │   └── seed.ts              # Datos de ejemplo
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/                    # SPA (Angular standalone)
    └── src/
        ├── app/
        │   ├── core/
        │   │   ├── models/      # Interfaces TypeScript (Categoria, Producto, Movimiento)
        │   │   └── services/    # AuthService, interceptor, guard, servicios HTTP CRUD
        │   ├── features/
        │   │   ├── login/
        │   │   ├── categorias/  # categoria-list + categoria-form
        │   │   ├── productos/   # producto-list + producto-form
        │   │   └── movimientos/ # movimiento-list + movimiento-form
        │   ├── app.component.ts     # Layout raíz + barra de navegación
        │   ├── app.routes.ts        # Rutas + lazy loading + guards
        │   └── app.config.ts        # Configuración (HttpClient, Router)
        ├── environments/
        ├── index.html
        ├── main.ts
        └── styles.css
```

**Stack elegido y por qué:**

| Capa | Tecnología | Motivo |
|---|---|---|
| Lenguaje | TypeScript | Tipado estático en frontend y backend, mismo lenguaje en todo el stack |
| Backend | Node.js + Express | Minimalista y el más usado para aprender APIs REST |
| ORM | Prisma | Tipado automático, migraciones sencillas, ideal para aprender relaciones |
| Base de datos | PostgreSQL | Motor relacional robusto y gratuito |
| Validación | Zod | Valida en tiempo de ejecución lo que TypeScript no puede (datos externos) |
| Auth | JWT + bcrypt | Estándar de la industria para APIs sin sesiones de servidor |
| Frontend | Angular (standalone) | Arquitectura completa: routing, forms, DI, RxJS |
| Gestor de paquetes | **pnpm** (más rápido y ahorra espacio en disco vs npm) |

> Este proyecto usa **pnpm** como gestor de paquetes. Instálalo una sola vez con:
> ```bash
> npm install -g pnpm
> ```
> A partir de ahí, todos los comandos de este README usan `pnpm`. La diferencia clave con `npm` es
> que para ejecutar un binario instalado localmente (lo que en npm sería `npx algo`) en pnpm se usa
> `pnpm exec algo`.

---

## 1. Requisitos previos

Instala en la computadora:

1. **Node.js LTS** (v18 o v20): https://nodejs.org
2. **PostgreSQL** (v14+): https://www.postgresql.org/download/
3. **Angular CLI** global:
   ```bash
   npm install -g @angular/cli
   ```
4. Un editor de código (recomendado VS Code) y **Git**.

Verifica las instalaciones:
```bash
node -v
npm -v
psql --version
ng version
```

---

## 2. Crear la base de datos en PostgreSQL

Abre una terminal con `psql` (o usa pgAdmin) y ejecuta:

```sql
CREATE DATABASE kinal_inventario;
```

Con eso es suficiente: Prisma se encargará de crear las tablas.

---

## 3. Backend paso a paso

### 3.1 Instalar dependencias

```bash
cd backend
pnpm install
```

> **Nota sobre pnpm y Prisma:** las versiones recientes de pnpm bloquean por seguridad los
> scripts de instalación (`postinstall`) de los paquetes. Si al instalar ves un mensaje como
> `[ERR_PNPM_IGNORED_BUILDS]`, ejecuta:
> ```bash
> pnpm approve-builds
> ```
> selecciona con espacio los paquetes de Prisma (`prisma`, `@prisma/client`, `@prisma/engines`),
> confirma con Enter, y vuelve a correr `pnpm install`. Este `package.json` ya trae configurado
> `onlyBuiltDependencies` para que esto no vuelva a pasar en instalaciones futuras.

### 3.2 Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y ajusta `DATABASE_URL` con tu usuario/password real de PostgreSQL:

```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/kinal_inventario?schema=public"
```

### 3.3 Generar el hash de la contraseña del administrador

```bash
pnpm exec ts-node src/scripts/generarHash.ts admin123
```

Copia el resultado en `ADMIN_PASSWORD_HASH` dentro de `.env`.

### 3.4 Crear las tablas con Prisma (migración)

```bash
pnpm exec prisma migrate dev --name init
```

Esto lee `prisma/schema.prisma`, genera el SQL, crea las 3 tablas
(`categorias`, `productos`, `movimientos`) en PostgreSQL, y genera el
cliente de Prisma tipado en `node_modules/@prisma/client`.

### 3.5 (Opcional) Insertar datos de ejemplo

```bash
pnpm exec prisma db seed
```

### 3.6 Levantar el servidor

```bash
pnpm run dev
```

Deberías ver: ` Servidor escuchando en http://localhost:3000`

### 3.7 Probar la API

Con el navegador, Postman, Insomnia o `curl`:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/categorias
curl http://localhost:3000/api/productos
```

Para probar el login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@kinal.edu.gt","password":"admin123"}'
```

Guarda el `token` que te devuelve; lo necesitas para crear/editar/eliminar (rutas protegidas).

> Tip: `pnpm exec prisma studio` abre una interfaz web para ver y editar las tablas visualmente.

---

## 4. Frontend paso a paso

### 4.1 Instalar Angular CLI (una sola vez)

```bash
pnpm add -g @angular/cli
```

### 4.2 Crear el proyecto Angular

**Importante:** el código ya escrito en `frontend/src` está pensado para un proyecto
Angular **standalone** (sin NgModules). Genera el proyecto base con el CLI, indicándole
que use pnpm, y luego reemplaza la carpeta `src.

```bash
cd ..   # regresa a la raíz kinal-inventario/
ng new kinal-inventario-frontend --standalone --routing --style=css --skip-git --package-manager=pnpm --ssr=false
```

> El flag `--ssr=false` evita que el CLI pregunte por Server-Side Rendering: este proyecto
> es una SPA normal, no lo necesitamos. Cuando te pregunte por "herramientas de IA" (Agents.md,
> Claude, Cursor, etc.), deja seleccionado **None** y presiona Enter.

Cuando el CLI termine de crear el proyecto, reemplaza su carpeta `src`:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force kinal-inventario-frontend\src
Copy-Item -Recurse frontend\src kinal-inventario-frontend\src
Copy-Item frontend\.npmrc kinal-inventario-frontend\.npmrc
```

**Mac/Linux:**
```bash
rm -rf kinal-inventario-frontend/src
cp -r frontend/src kinal-inventario-frontend/src
cp frontend/.npmrc kinal-inventario-frontend/.npmrc
```

*(Si prefieres, simplemente crea manualmente cada archivo dentro del proyecto generado por
`ng new`, copiando el contenido que te entregamos — es exactamente lo mismo).*

### 4.3 Instalar dependencias

```bash
cd kinal-inventario-frontend
pnpm install
```

### 4.4 Levantar el frontend

```bash
pnpm exec ng serve -o
```

*(Si instalaste el Angular CLI de forma global con `pnpm add -g @angular/cli`, también puedes
usar simplemente `ng serve -o`).*

Se abrirá `http://localhost:4200`. Angular consumirá la API en `http://localhost:3000/api`
(configurado en `src/environments/environment.ts`).

### 4.5 Flujo de prueba recomendado

1. Ve a **Categorías** → inicia sesión primero (`/login`, usuario `admin@kinal.edu.gt`)
2. Crea 1-2 categorías (ej. "Papelería", "Limpieza")
3. Ve a **Productos** → crea productos asignándolos a una categoría
4. Ve a **Movimientos** → registra una **ENTRADA** o **SALIDA** y observa cómo cambia
   el stock del producto en la lista de Productos

---

## 5. Cómo funciona cada tema del temario en este proyecto

| Tema del temario | Dónde lo ves en el proyecto |
|---|---|
| Arrow functions, destructuring, spread | Controladores y servicios (`const { nombre } = req.body`, etc.) |
| Promesas / async-await | Todos los métodos de `services/*.ts` y `controllers/*.ts` |
| Interfaces, tipos, unión | `core/models/*.ts`, `TipoMovimiento = "ENTRADA" \| "SALIDA"` |
| Genéricos | `ApiResponse<T>`, `catchAsync<T>` |
| Utility types (`Partial`, `Omit`) | `CategoriaForm`, `actualizarCategoriaSchema.partial()` |
| Módulos ES (`import`/`export`) | Todo el proyecto (backend usa `esModuleInterop` con CommonJS de Node) |
| Node core (`http`, eventos) | Express se construye sobre el módulo `http` de Node |
| Express.js | `backend/src/index.ts`, `routes/*.ts` |
| Endpoints REST + middlewares | `errorHandler.ts`, `auth.ts`, todas las rutas |
| ORM (Prisma) + PostgreSQL | `prisma/schema.prisma`, `config/prisma.ts` |
| JWT + bcrypt + validación | `auth.controller.ts`, `types/*.types.ts` (Zod) |
| Variables de entorno (`dotenv`) | `.env`, `import "dotenv/config"` en `index.ts` |
| Angular CLI, arquitectura | Todo `frontend/` |
| Data binding, `*ngIf`/`*ngFor` | Todos los `.html` de `features/` |
| Ciclo de vida (`ngOnInit`) | `categoria-list.component.ts`, etc. |
| Pipes (`date`, `currency`) | `producto-list.component.html`, `movimiento-list.component.html` |
| Routing, params, guards, lazy loading | `app.routes.ts`, `auth.guard.ts` |
| Formularios reactivos + validación | Todos los `*-form.component.ts` (`FormBuilder`, `Validators`) |
| HttpClientModule | `provideHttpClient` en `app.config.ts` + servicios |
| RxJS (Observables, operadores) | Servicios (`Observable<ApiResponse<T>>`), `tap()` en `AuthService` |
| Manejo de estado con servicios | `AuthService`, `CategoriaService`, etc. (todos `providedIn: 'root'`) |

---

## 6. Siguientes pasos sugeridos (para seguir aprendiendo)

1. **Testing**: agrega pruebas unitarias con Jasmine/Karma a un componente (ej. `CategoriaListComponent`)
   y con Jest/Supertest al backend.
2. **NgRx**: si el proyecto crece, migra el estado compartido (ej. lista de productos) a un store de NgRx.
3. **ESLint + Prettier**: agrega `.eslintrc` y `.prettierrc` en ambos proyectos para mantener el código limpio.
4. **Monorepo**: si quieres unir frontend y backend en un solo repo con herramientas compartidas, explora **Nx**.
5. **Despliegue**:
   - Backend: Railway, Render o un droplet de DigitalOcean (con PostgreSQL administrado)
   - Frontend: `ng build` genera la carpeta `dist/`, que puedes subir a Vercel, Netlify o un bucket S3
6. **Roles**: agrega un cuarto modelo `Usuario` en Prisma si luego quieres varios usuarios con roles distintos
   (por ahora el login usa un único administrador definido en `.env` para mantener el proyecto en 3 tablas).

---

## 7. Comandos rápidos (resumen)

```bash
# Instalar pnpm (una sola vez)
npm install -g pnpm

# Backend
cd backend
pnpm install
copy .env.example .env      # Windows (usa 'cp' en Mac/Linux)
# editar DATABASE_URL / ADMIN_PASSWORD_HASH en el .env
pnpm exec prisma migrate dev --name init
pnpm exec prisma db seed
pnpm run dev                # http://localhost:3000

# Frontend (en otra terminal)
pnpm add -g @angular/cli
ng new kinal-inventario-frontend --standalone --routing --style=css --package-manager=pnpm
# reemplazar su carpeta src/ por la de frontend/src de este paquete
cd kinal-inventario-frontend
pnpm install
pnpm exec ng serve -o       # http://localhost:4200
```

Con esto se tiene un sistema de inventario funcional con
TypeScript, Node.js y Angular.
