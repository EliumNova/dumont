import fs from "fs";
import path from "path";
/**
 * Crea una carpeta o carpetas si no existe(n).
 * @param {string} folderPath - Ruta de la carpeta a crear.
 */
export const createFolders = (folderPath) => {
  const userFolderPath = path.join(folderPath);
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath, { recursive: true });
  }
};
/**
 * Elimina la carpeta especificada y todos sus archivos y/o subcarpetas.
 * @param {string} folderPath - Ruta de la carpeta a eliminar.
 */
export const deleteFolderRecursively = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursively(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};
