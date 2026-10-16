# DuMont

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
