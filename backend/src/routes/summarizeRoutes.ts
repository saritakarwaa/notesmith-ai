import express from "express";
import multer from "multer";
import { summarizeText } from "../controllers/summarizeController";

const upload = multer();
const router = express.Router();

router.post("/", upload.single("file"), summarizeText as express.RequestHandler);

export default router;
