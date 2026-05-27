import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { checkATS, checkATSWithFile } from "../controllers/atsController.js";
import upload from "../middlewares/uploadMiddleware.js";

const atsRouter = express.Router();

atsRouter.post("/check", protect, checkATS);
atsRouter.post("/check-file", protect, upload.single("resume"), checkATSWithFile);

export default atsRouter;
