import expressAsyncHandler from "express-async-handler";
import {
  deleteFolderRecursively,
  createFolders,
} from "../../utils/utilsFiles.js";
import { fileError, handleError } from "../../utils/utilsErrors.js";
import fs from "fs";
import path from "path";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryUrl,
} from "../../utils/utilsCloudinary.js";

// En Windows, file.path viene con backslashes (ej. "public\\uploads\\videos\\
// x.mp4"). Se normalizan siempre a "/" y se quita el prefijo "public/".
const toPublicUrlPath = (filePath) =>
  filePath.replace(/\\/g, "/").replace(/^public\//, "");

// Dominio público de ESTE backend, para armar las URLs de los archivos. Se
// toma del propio pedido (así nunca queda apuntando al frontend ni a
// localhost por una variable mal configurada). Detrás del proxy de Render el
// protocolo y el host reales vienen en los headers x-forwarded-*. Si hace
// falta forzarlo, se puede definir PUBLIC_BASE_URL.
const apiBase = (req) => {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL.replace(/\/+$/, "");
  }
  const proto = (req.get("x-forwarded-proto") || req.protocol || "http")
    .split(",")[0]
    .trim();
  const host = (req.get("x-forwarded-host") || req.get("host") || "")
    .split(",")[0]
    .trim();
  return `${proto}://${host}`;
};

// Devuelve la URL pública del archivo: Cloudinary si está configurado
// (file.buffer), o disco local si no.
const saveAndGetUrl = async (file, req) => {
  if (file.buffer) return uploadToCloudinary(file);
  return `${apiBase(req)}/${toPublicUrlPath(file.path)}`;
};

const createFile = expressAsyncHandler(async (req, res) => {
  try {
    if (req.fileValidationError) throw new Error(req.fileValidationError);
    if (req.file) {
      const url = await saveAndGetUrl(req.file, req);
      res.status(200).send({ url });
    } else if (req.files) {
      const files = Object.values(req.files).flat();
      //Si files es un array de archivos, urls tendrá el mismo orden que el array que se manden los archivos.
      const urls = await Promise.all(files.map((f) => saveAndGetUrl(f, req)));
      return res.status(200).send({ urls });
    }
  } catch (error) {
    fileError(error, req, res);
  }
});

// Borra un archivo a partir de su URL pública (Cloudinary o disco local).
const removeByUrl = async (url) => {
  if (typeof url !== "string") return;
  if (isCloudinaryUrl(url)) {
    await deleteFromCloudinary(url);
    return;
  }
  // Solo se borran archivos locales servidos desde /uploads/ (sin importar
  // el dominio con el que se guardó la URL).
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  } catch {
    return;
  }
  if (!pathname.startsWith("/uploads/")) return;
  const relative = pathname.replace(/^\/+/, "");
  const target = path.join("public", relative);
  // Evita salir de public/ con rutas tipo "../"
  if (!path.resolve(target).startsWith(path.resolve("public") + path.sep)) return;
  if (fs.existsSync(target)) fs.unlinkSync(target);
  // Si la carpeta queda vacía, se elimina.
  const folder = path.dirname(target);
  if (fs.existsSync(folder) && fs.readdirSync(folder).length === 0) {
    deleteFolderRecursively(folder);
  }
};

const updateFile = expressAsyncHandler(async (req, res) => {
  try {
    const { deletedFiles } = req.body;
    if (deletedFiles) {
      const filesToDelete = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      await Promise.all(filesToDelete.map(removeByUrl));
    }
    // createFile responde al cliente con las URLs nuevas.
    await createFile(req, res);
  } catch (error) {
    fileError(error, req, res);
  }
});

const deleteFile = expressAsyncHandler(async (req, res) => {
  try {
    await removeByUrl(req.body.url);
    return res.status(200).send("Archivo eliminado");
  } catch (error) {
    handleError(error, res);
  }
});

const deleteFolder = expressAsyncHandler(async (req, res) => {
  let dir = "public";
  const folders = {
    images: path.join(dir, "uploads/images"),
    videos: path.join(dir, "uploads/videos"),
  };
  // Determina la ruta completa donde se guardará el archivo, usando una ruta temporal si no coincide con ninguna anterior.
  const fullDirName = folders[req.params.type];
  deleteFolderRecursively(fullDirName);
  return res.status(200).send("Carpeta eliminada");
});

const filesController = {
  createFolders,
  createFile,
  updateFile,
  deleteFile,
  deleteFolder,
};

export default filesController;
