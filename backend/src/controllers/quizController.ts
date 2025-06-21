import { Request, Response } from "express";
import { extractTextFromInput } from "../utils/extractText";

export async function generateQuiz(req: Request, res: Response) {
  try {
    const text = await extractTextFromInput({
      text: req.body.text,
      fileBuffer: req.file?.buffer,
    });

    // TODO: Replace with real quiz generation logic or API
    const quiz = [
      {
        question: "What is a summary of the text?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A",
      },
    ];

    res.json({ quiz });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}
