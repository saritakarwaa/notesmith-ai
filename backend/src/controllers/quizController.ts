import { Request, Response } from "express";
import { extractTextFromInput } from "../utils/extractText";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";

export async function generateQuiz(req: Request, res: Response) {
  try {
    const text = await extractTextFromInput({
      text: req.body.text,
      fileBuffer: req.file?.buffer,
    });
    
    const HF_apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!HF_apiKey) {
      return res.status(500).json({ message: "Missing HuggingFace API Key" });
    }
    const prompt = `Generate 10 multiple choice questions from the text below. 
      Each question should:
      - Be clear and concise
      - Have 4 options (a, b, c, d)
      - Have the correct answer labeled with "Correct answer: "
      - Cover different aspects of the text
      
      Return the questions in the following JSON format:
      {
        "questions": [
          {
            "question": "What is...?",
            "options": {
              "a": "Option 1",
              "b": "Option 2",
              "c": "Option 3",
              "d": "Option 4"
            },
            "correctAnswer": "a"
          },
          ...
        ]
      }
      
      Text:
      ${text}`;
    const response = await axios.post(
       "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        inputs: prompt.trim(),
        parameters: {
          max_new_tokens: 2000,
          temperature:0.7,
          return_full_text: false,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    const quiz = response.data?.[0]?.generated_text;
    if (!quiz) {
      return res.status(502).json({ message: "No quiz generated" });
    }
    res.json({quiz})
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}
