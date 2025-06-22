import { Request, Response } from "express";
import { extractTextFromInput } from "../utils/extractText";
import axios from "axios";

export async function generateQuiz(req: Request, res: Response) {
  try {
    const text = await extractTextFromInput({
      text: req.body.text,
      fileBuffer: req.file?.buffer,
    });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing Google Gemini API Key" });
    }

    const prompt = `Generate 10 multiple choice questions from the following text.
Each question should:
- Be clear and concise
- Have 4 options (a, b, c, d)
- Include the correct answer in the format "correctAnswer": "a"
- Return only the output in JSON format like this:
{
  "questions": [
    {
      "question": "Sample?",
      "options": {
        "a": "One",
        "b": "Two",
        "c": "Three",
        "d": "Four"
      },
      "correctAnswer": "b"
    }
  ]
}

Text:
${text}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const quiz = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!quiz) {
      return res.status(502).json({ message: "No quiz generated" });
    }

    res.json({ quiz });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}
