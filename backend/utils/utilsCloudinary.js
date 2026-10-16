import crypto from "crypto";

// Cloudinary opcional, sin dependencias: se usa la API REST con firma SHA-1.
// Configuración (cualquiera de las dos formas):
//   CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
//   CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET

export const getCloudinaryConfig = () => {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    try {
      const u = new URL(url);
      if (u.protocol === "cloudinary:" && u.username && u.password && u.hostname) {
        return {
          apiKey: decodeURIComponent(u.username),
          apiSecret: decodeURIComponent(u.password),
          cloudName: u.hostname,
        };
      }
    } catch {
      // formato inválido: se intenta con las variables sueltas
    }
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    return {
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY,
      apiSecret: CLOUDINARY_API_SECRET,
    };
  }
  return null;
};

export const cloudinaryEnabled = () => getCloudinaryConfig() !== null;

const sign = (params, apiSecret) => {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
};

const resourceTypeOf = (mimetype = "") =>
  mimetype.startsWith("video/") ? "video" : "image";

/**
 * Sube un archivo de multer (memoryStorage) a Cloudinary y devuelve su URL https.
 */
export const uploadToCloudinary = async (file) => {
  const cfg = getCloudinaryConfig();
  const resourceType = resourceTypeOf(file.mimetype);
  const params = {
    folder: `dumont/${resourceType === "video" ? "videos" : "images"}`,
    timestamp: Math.floor(Date.now() / 1000),
  };
  const form = new FormData();
  form.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append("api_key", cfg.apiKey);
  Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
  form.append("signature", sign(params, cfg.apiSecret));

  const resp = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/upload`,
    { method: "POST", body: form },
  );
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.error?.message || "Error al subir a Cloudinary");
  }
  return data.secure_url;
};

export const isCloudinaryUrl = (url) =>
  typeof url === "string" && /^https?:\/\/res\.cloudinary\.com\//.test(url);

/**
 * Elimina un archivo de Cloudinary a partir de su URL. No lanza si no existe.
 */
export const deleteFromCloudinary = async (url) => {
  const cfg = getCloudinaryConfig();
  if (!cfg) return false;
  const m = url.match(/\/(image|video|raw)\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?(?:\?.*)?$/);
  if (!m) return false;
  const [, resourceType, publicId] = m;
  const params = {
    public_id: decodeURIComponent(publicId),
    timestamp: Math.floor(Date.now() / 1000),
  };
  const form = new FormData();
  form.append("api_key", cfg.apiKey);
  Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
  form.append("signature", sign(params, cfg.apiSecret));
  const resp = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/destroy`,
    { method: "POST", body: form },
  );
  return resp.ok;
};
