import multer from "multer";
import fs from "fs";
import path from "path";
import { createFolders } from "../../utils/utilsFiles.js";
import { cloudinaryEnabled } from "../../utils/utilsCloudinary.js";
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "public";
    const folders = {
      image: path.join(dir, "uploads/images"),
      video: path.join(dir, "uploads/videos"),
      files: path.join(dir, "uploads/files"),
    };
    const fullDirName = folders[file.fieldname] || path.join(dir, "temp");
    createFolders(fullDirName);
    cb(null, fullDirName);
  },
  filename: (res, file, callback) => {
    const ext = file.originalname.split(".").pop();
    const fileName = Date.now();
    callback(null, `${fileName}.${ext}`);
  },
});

// Con Cloudinary configurado se guarda en memoria y el controlador sube el
// buffer; si no, se guarda en disco local (public/uploads).
const storage = cloudinaryEnabled() ? multer.memoryStorage() : diskStorage;

const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image", "video"];
  if (allowedMimes.includes(file.mimetype.split("/")[0])) {
    cb(null, true);
  } else {
    req.fileValidationError = "Archivo no permitido";
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
