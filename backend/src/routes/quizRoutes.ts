import express from "express";
import multer from "multer";
import { generateQuiz } from "../controllers/quizController";

const upload = multer();
const router = express.Router();

router.post("/", upload.single("file"), generateQuiz as express.RequestHandler);

export default router;
