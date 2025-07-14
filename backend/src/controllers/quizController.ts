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

    const prompt = `Generate a proportionate number of multiple-choice questions (roughly 1 per paragraph or every 100-150 words) from the following text.
Each question should:
- Be clear and concise
- Have 4 options (a, b, c, d)
- Include the correct answer in the format "correctAnswer": "a
- Please return the output as raw JSON without wrapping it in triple backticks or markdown.
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
    const cleanedQuiz = quiz
      .replace(/^\s*```(?:json)?\s*/, '')  
      .replace(/\s*```\s*$/, '')          
      .trim();
    let quizJSON;
    try {
      quizJSON = JSON.parse(cleanedQuiz);
    } catch (error) {
      console.error("Failed to parse quiz JSON:", cleanedQuiz);
      return res.status(500).json({ message: "Quiz JSON is invalid", error: (error as Error).message });
    }
    res.json({ quiz:quizJSON });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}


export async function generateTopicQuiz(req:Request,res:Response) {
  try{
    const topic=req.body.text
    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ message: "No topic provided" });
    }
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing Google Gemini API Key" });
    }
    const prompt = `Generate a comprehensive set of multiple choice questions on the topic "${topic}".

      Guidelines:
      - Cover a broad range of subtopics and difficulty levels (basic to advanced).
      - Avoid repeating similar questions.
      - Each question must have **4 options** labeled "a", "b", "c", and "d".
      - Clearly identify the correct option using the format: "correctAnswer": "a"
      - Ensure the JSON is valid and **not wrapped in Markdown or triple backticks**.
      - Return only JSON in this format:

      {
        "questions": [
          {
            "question": "Example question?",
            "options": {
              "a": "Option A",
              "b": "Option B",
              "c": "Option C",
              "d": "Option D"
            },
            "correctAnswer": "b"
          }
        ]
      }`;

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
              headers: { "Content-Type": "application/json" },
            }
          );

      const quiz=response.data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!quiz) {
        return res.status(502).json({ message: "No quiz generated" });
      }
      const cleaned = quiz.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      let quizJSON;
      try {
        quizJSON = JSON.parse(cleaned);
      } catch (err) {
        return res.status(500).json({ message: "Invalid JSON", error: (err as Error).message });
      }

      res.json({ quiz: quizJSON });
  }
  catch(err){
    res.status(500).json({ message: "Server Error", error: (err as Error).message });
  }
}