import { useState } from "react";
import { useDispatch } from "react-redux";
import { setQuiz, setSummary } from "@/features/notesSlice";
import { useToast } from "@/hooks/use-toast";

const baseUrl = "http://localhost:3000/api";

type UseApiReturn = {
  loading: boolean;
  summarize: (fd: FormData) => Promise<string | null>;
  generateQuiz: (fd: FormData) => Promise<string | null>;
  generateTopicQuiz: (text: string) => Promise<string | null>;
};

export const useNotesmithApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const summarize = async (formData: FormData): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/summarize`, { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok && json.summary) {
        dispatch(setSummary(json.summary));
        return json.summary;         
      }
      throw new Error(json.message || "No summary returned.");
    } catch (err) {
      toast({ title: "Error generating summary", description: (err as Error).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (formData: FormData): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/generate-quiz`, { method: "POST", body: formData });
      const json = await res.json();

      if (res.ok && json.quiz) {
        dispatch(setQuiz(json.quiz));
        return json.quiz;
      }
      throw new Error(json.message || "No quiz returned.");
    } catch (err) {
      toast({ title: "Error generating quiz", description: (err as Error).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateTopicQuiz = async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/generate-quiz/topic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();

      if (res.ok && json.quiz) {
        dispatch(setQuiz(json.quiz));
        return json.quiz;
      }
      throw new Error(json.message || "No quiz returned.");
    } catch (err) {
      toast({ title: "Topic Quiz Failed", description: (err as Error).message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, summarize, generateQuiz, generateTopicQuiz };
};
