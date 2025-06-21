import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarizeRoutes"
import quizRoutes from "./routes/quizRoutes"
import dotenv from 'dotenv'


const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/summarize",summarizeRoutes);
app.use("/api/generate-quiz",quizRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
