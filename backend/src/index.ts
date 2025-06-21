import express from "express";
import cors from "cors";
import summarizeRoutes from "./routes/summarizeRoutes"
import quizRoutes from "./routes/quizRoutes"

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/summarize",summarizeRoutes);
app.use("/api/generate-quiz",quizRoutes)

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
