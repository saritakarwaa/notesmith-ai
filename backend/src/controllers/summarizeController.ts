import { Request, Response } from "express";
import { extractTextFromInput } from "../utils/extractText";
import axios from "axios";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

function splitTextIntoChunks(text: string, maxWords: number = 1000): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}

export async function summarizeText(req: FileRequest, res: Response) {
  try {
    const text = await extractTextFromInput({
      text: req.body.text,
      fileBuffer: req.file?.buffer,
    });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing Google Gemini API Key" });
    }

    const chunks = splitTextIntoChunks(text, 1000);
    const summaries: string[] = [];

    for (const chunk of chunks) {
      const prompt = `Summarize this section of a longer text. Be clear and detailed:\n\n${chunk}`;

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

      const partial = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (partial) summaries.push(partial.trim());

      // Optional: wait a bit between requests to avoid rate limits
      await new Promise((r) => setTimeout(r, 500));
    }

    const finalSummary = summaries.join("\n\n");
    res.json({ summary: finalSummary });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({ message: "Error summarizing text" });
  }
}
