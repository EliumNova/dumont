import expressAsyncHandler from "express-async-handler";
import {
  deleteFolderRecursively,
  createFolders,
} from "../../utils/utilsFiles.js";
import { fileError, handleError } from "../../utils/utilsErrors.js";
import fs from "fs";
import path from "path";

// En Windows, file.path viene con backslashes (ej. "public\\uploads\\videos\\
// x.mp4"). El .replace("public/", "") viejo buscaba forward slash y nunca
// matcheaba en Windows, así que "public" quedaba pegado en la URL final y
// las barras invertidas se mandaban tal cual dentro de una URL (inválido) —
// por eso los videos/imágenes tiraban 404 al cargarlos en el navegador.
const toPublicUrlPath = (filePath) =>
  filePath.replace(/\\/g, "/").replace(/^public\//, "");

const createFile = expressAsyncHandler(async (req, res) => {
  try {
    const { file } = req;
    if (req.fileValidationError) throw new Error(req.fileValidationError);
    console.log(file);
    if (req.file) {
      const createdFile = toPublicUrlPath(req.file.path);
      console.log(createdFile);
      res.status(200).send({ url: `${process.env.API_URL}/${createdFile}` });
    } else if (req.files) {
      const files = Object.values(req.files).flat();

      const uploadPromises = files.map(async (file) => {
        const createdFile = toPublicUrlPath(file.path);
        return `${process.env.API_URL}/${createdFile}`;
      });

      const urls = await Promise.all(uploadPromises);

      //Si files es un array de archivos, urls tendrá el mismo orden que el array que se manden los archivos.
      return res.status(200).send({ urls });
    }
  } catch (error) {
    fileError(error, req, res);
  }
});

const updateFile = expressAsyncHandler(async (req, res) => {
  try {
    const { deletedFiles } = req.body;
    if (deletedFiles) {
      const filesToDelete = Array.isArray(deletedFiles)
        ? deletedFiles
        : [deletedFiles];
      console.log(filesToDelete);
      filesToDelete.forEach(async (file) => {
        if (file.startsWith(process.env.API_URL)) {
          // Reemplaza el nombre del dominio de donde esta guardado el archivo por "public" para poder actualizarlo.
          file = file.replace(process.env.API_URL, "public");

          // Obtiene la ruta de la carpeta de ese archivo.
          const folder = file.split("\\").slice(0, 2).join("\\");

          console.log(file);
          if (fs.existsSync(file)) fs.unlinkSync(file);
          // Si por eliminar ese archivo la carpeta queda vacía, se elimina directamente.
          fs.readdirSync(folder, (err, files) => {
            if (err) console.log(err);

            if (files.length == 0) deleteFolderRecursively(folder);
          });
        }
      });
    }
    createFile(req, res);
    console.log(file);
    res.status(200).send({
      success: true,
      message: "File uploaded successfully",
      fileName: file.filename,
    });
  } catch (error) {
    fileError(error, req, res);
  }
});

const deleteFile = expressAsyncHandler(async (req, res) => {
  try {
    let url = req.body.url.replace(process.env.API_URL, "public");
    console.log(url);

    if (fs.existsSync) fs.unlinkSync(url);

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
