# DuMont

Sistema de gestión de dispositivos, clientes y distribuidores, con una app web de kiosco para tablets.

- `frontend/`: Next.js 15 (puerto 3000 en desarrollo).
- `backend/`: Express + Sequelize + MySQL 5.7 (API bajo `/api/*`).

## Desarrollo local

1. **Base de datos**: MySQL 5.7. Con Docker: `cd backend/docker && docker compose up -d`
   (levanta MySQL en 3306 y phpMyAdmin en 8080; ajustá usuario/clave a tu `.env`).
2. **Esquema**: `sequelize.sync()` crea las tablas que faltan pero **no modifica las existentes**.
   Los cambios de esquema se aplican con SQL manual: ejecutá `migracion_dumont.sql`
   (ver "Migraciones" abajo).
3. **Backend**:
   ```bash
   cd backend
   cp .env.example .env     # completar DB_*, JWT_SECRET, etc.
   npm install
   node src/index.js        # o: npx nodemon src/index.js
   ```
4. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env     # NEXT_PUBLIC_API_URL = URL del BACKEND
   npm install
   npm run dev
   ```
5. Abrí http://localhost:3000. Para probar desde una tablet/celular en la LAN entrá por la IP de tu PC
   y agregala a `ALLOWED_DEV_ORIGINS` (frontend). El backend ya permite IPs de red local en el puerto 3000
   fuera de producción (`CORS_ALLOW_LAN`).

### Variables de entorno

Ver `backend/.env.example` y `frontend/.env.example` (todas documentadas). Importante:

- `API_URL` (backend) es la URL pública **del backend** (ej. `http://localhost:4000` o
  `https://dumont-api.onrender.com`), **no** la del frontend. Con ella se arman las URLs de archivos subidos a disco.
- `NEXT_PUBLIC_API_URL` (frontend) también apunta al **backend**. Es una variable de build: si la cambiás hay que
  volver a construir/desplegar el frontend.
- `CORS_ORIGINS` (backend): orígenes del frontend, separados por comas. Sin definir se usan
  `http://localhost:3000` y `https://dumont.onrender.com`.
- Los endpoints protegidos (`checkAuth`) esperan `Authorization: Bearer <token>`; el frontend lo agrega
  automáticamente con un interceptor de axios usando el token guardado en `localStorage["authToken"]` al hacer login.

## Migraciones

Los cambios de esquema van como SQL (MySQL 5.7 no soporta `ADD COLUMN IF NOT EXISTS`). Si `migracion_dumont.sql`
no está en el repo, pedíselo al equipo o generalo a partir de los modelos antes del primer deploy y ejecutalo
contra la base (`mysql -u USER -p dumont < migracion_dumont.sql`). Los modelos `Multimedia` y `MultimediaAsignacion`
usan `tableName` fijo (singular) para coincidir con ese script.

## Subida de archivos (imágenes y videos)

El backend guarda los archivos de `/api/files/*` en uno de dos lugares:

- **Cloudinary** (recomendado en Render, donde el disco es efímero): se activa si
  está definida `CLOUDINARY_URL` (`cloudinary://API_KEY:API_SECRET@CLOUD_NAME`) o las
  tres variables `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
  La URL devuelta es la `https://res.cloudinary.com/...` del archivo.
- **Disco local** (`backend/public/uploads`): si no hay variables de Cloudinary. La URL
  se arma con `API_URL` (debe apuntar al **backend**). En Render estos archivos se
  pierden en cada deploy/reinicio.

Las rutas se normalizan siempre con `/` (también en Windows).

## Deploy en Render

### Base de datos
Render no ofrece MySQL gestionado: usá un MySQL 5.7 externo (o un servicio Docker propio con disco persistente)
y cargá el esquema con `migracion_dumont.sql`.

### Backend (Web Service)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Variables: `PORT` (Render lo inyecta), `NODE_ENV=production`, `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`,
  `JWT_SECRET`, `API_URL=https://<tu-backend>.onrender.com` (URL del **backend**),
  `CORS_ORIGINS=https://<tu-frontend>.onrender.com`, `SOPORTE_TELEFONO`, `SOPORTE_WHATSAPP`, `SOPORTE_EMAIL`,
  y `CLOUDINARY_URL` (recomendado, por el disco efímero).

### Frontend (Web Service o Static)
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Variables: `NEXT_PUBLIC_API_URL=https://<tu-backend>.onrender.com`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`.
  (Definirlas **antes** del build.)

Luego agregá la URL del frontend en `CORS_ORIGINS` del backend y reiniciá el backend.
