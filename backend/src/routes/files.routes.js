import express from "express";
import upload from "../middleware/files.js";
import filesController from "../controllers/files.controller.js";

const filesRouter = express.Router();

const { createFile, updateFile, deleteFile } = filesController;

filesRouter.post(
  "/upload",
  upload.fields([
    {
      name: "image",
      maxCount: 2,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  createFile
);
filesRouter.post("/upload-multiple", upload.array("image"), createFile);
filesRouter.put(
  "/update",
  upload.fields([
    {
      name: "image",
      maxCount: 2,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  updateFile
);

filesRouter.delete("/delete", deleteFile);

export default filesRouter;
