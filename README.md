# Slack Clone — Frontend

Aplicación web de mensajería en tiempo real estilo Slack. Desarrollada con React + Vite como trabajo integrador final para UTN.

**Demo en vivo:** https://utn-2026-frontend-utn-pwa-proyecto.vercel.app  
**Repositorio backend:** https://github.com/Nacho9933/2026_BACKEND-UTN-PWA_PROYECTO_FINAL

---

## Tecnologías

- React 19 + Vite 8
- React Router v7 (rutas anidadas)
- CSS Modules (sin frameworks UI)
- lucide-react (íconos)
- jwt-decode

---

## Funcionalidades

- Registro con verificación por email y confirmación de contraseña
- Login con JWT — rutas protegidas por middleware
- Workspaces: crear, listar, editar y eliminar
- Canales dentro de cada workspace: CRUD completo
- Mensajes en canales: enviar, editar y borrar los propios — con polling cada 3s
- Mensajes directos (DMs) 1 a 1 entre usuarios — CRUD + polling
- Gestión de miembros: invitar por email, cambiar rol, expulsar
- Recuperación y restablecimiento de contraseña
- Layout tipo Slack: sidebar + panel de mensajes + panel de miembros
- Diseño responsivo (320px a 2000px), tema oscuro

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nacho9933/utn-proyecto-final-pwa-frontend
cd utn-proyecto-final-pwa-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y setear VITE_URL_API con la URL del backend

# 4. Iniciar en modo desarrollo
npm run dev
```

El frontend corre en `http://localhost:5173`.

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_URL_API` | URL base del backend | `http://localhost:3000` |

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |
| `npm run lint` | Análisis estático ESLint |

---

## Credenciales de prueba

| Campo | Valor |
|---|---|
| Email | `COMPLETAR` |
| Contraseña | `COMPLETAR` |
