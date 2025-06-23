import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useDispatch } from 'react-redux';
import { setQuiz, setSummary } from '@/features/notesSlice';

// Types
type QuizQuestion = {
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
};

type Quiz = {
  questions: QuizQuestion[];
};

type DialogData = {
  open: boolean;
  title: string;
  content: string | Quiz;
};

const InteractiveQuiz = ({ questions }: { questions: QuizQuestion[] }) => {
  const [userAnswers, setUserAnswers] = useState<{ [index: number]: string }>({});

  const handleOptionClick = (index: number, option: string) => {
    setUserAnswers(prev => ({ ...prev, [index]: option }));
  };

  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const selected = userAnswers[index];
        const isCorrect = selected === q.correctAnswer;

        return (
          <div key={index} className="bg-[#313244] p-4 rounded-lg">
            <p className="mb-3 font-semibold text-[#f5e0dc]">
              {index + 1}. {q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(q.options).map(([key, option]) => {
                const isSelected = selected === key;
                const isCorrectSelection = isSelected && isCorrect;
                const isWrongSelection = isSelected && !isCorrect;

                return (
                  <button
                    key={key}
                    onClick={() => handleOptionClick(index, key)}
                    className={`text-left p-2 rounded border ${
                      isCorrectSelection
                        ? "bg-green-500 border-green-700 text-white"
                        : isWrongSelection
                        ? "bg-red-500 border-red-700 text-white"
                        : "bg-[#1e1e2e] border-[#45475a] hover:border-[#f2cdcd]"
                    }`}
                  >
                    {key}. {option}
                  </button>
                );
              })}
            </div>

            {selected && (
              <p className="mt-2 text-sm">
                {isCorrect ? (
                  <span className="text-green-400">✅ Correct!</span>
                ) : (
                  <span className="text-red-400">
                    ❌ Incorrect. Correct answer: <strong>{q.correctAnswer}</strong>
                  </span>
                )}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

const NotesmithAI = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [dialogData, setDialogData] = useState<DialogData>({ open: false, title: '', content: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isGeneratingTopicQuiz, setIsGeneratingTopicQuiz] = useState(false);
  const baseUrl = "http://localhost:3000/api";

  const validateAndHandleFile = (file: File): boolean => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
      toast({ title: "Unsupported file type", description: "Please upload a TXT, PDF, DOC, or DOCX file." });
      return false;
    }
    if (file.size > maxSize) {
      toast({ title: "File too large", description: "Please upload a file smaller than 10MB." });
      return false;
    }
    setUploadedFile(file);
    toast({ title: "File uploaded successfully", description: `${file.name} is ready for processing.` });
    return true;
  };

  const buildFormData = (): FormData => {
    const formData = new FormData();
    if (uploadedFile) formData.append("file", uploadedFile);
    else formData.append("text", textInput);
    return formData;
  };

  const hasContent = uploadedFile || textInput.trim().length > 0;

  const handleSummarize = async () => {
    if (!hasContent) return;
    setIsSummarizing(true);
    try {
      const formData = buildFormData();
      const response = await fetch(`${baseUrl}/summarize`, { method: 'POST', body: formData });
      const data = await response.json();

      if (response.ok && data.summary) {
        dispatch(setSummary(data.summary));
        setDialogData({ open: true, title: 'Summary', content: data.summary });
      } else {
        throw new Error(data.message || "No summary returned.");
      }
    } catch (error) {
      toast({ title: "Error generating summary", description: (error as Error).message });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!hasContent) return;
    setIsGeneratingQuiz(true);
    try {
      const formData = buildFormData();
      const response = await fetch(`${baseUrl}/generate-quiz`, { method: 'POST', body: formData });
      const data = await response.json();

      if (response.ok && data.quiz) {
        dispatch(setQuiz(data.quiz));
        setDialogData({ open: true, title: 'Quiz', content: data.quiz });
      } else {
        throw new Error(data.message || "No quiz returned.");
      }
    } catch (error) {
      toast({ title: "Error generating quiz", description: (error as Error).message });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateTopicQuiz=async()=>{
    if(!textInput.trim()) return;
    setIsGeneratingTopicQuiz(true);
    try{
      const response=await fetch(`${baseUrl}/generate-quiz/topic`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      })
      const data=await response.json()
      console.log(data)
      console.log("Status:", response.status);
      if(response.ok && data.quiz){
        dispatch(setQuiz(data.quiz))
        setDialogData({
          open:true,
          title:"Quiz",
          content:data.quiz
        })
      }
      else{
        setDialogData({ open: true, title: "Error", content: data.message });
        toast({ title: "Topic Quiz Failed", description: data.message || "No quiz returned." });
      }
    }
    catch(error){
      toast({ title: "Error", description: "Something went wrong." });
    }
    finally{
      setIsGeneratingTopicQuiz(false)
    }
  }

  return (
    <div className="min-h-screen w-full py-10 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center bg-[#1e1e2e] text-[#cdd6f4]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 text-[#cba6f7]">
          <FileText className="h-7 w-7" /> Notesmith AI
        </h1>
        <p className="mt-2 text-base text-[#f2cdcd]">
          Transform your content with AI-powered summarization and quiz generation
        </p>
      </div>

      {/* Inputs */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
              <Upload className="h-5 w-5 text-[#89b4fa]" /> Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); validateAndHandleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#313244] rounded-md p-6 h-48 cursor-pointer text-center flex flex-col justify-center items-center hover:border-[#f5e0dc] transition"
            >
              <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" onChange={e => validateAndHandleFile(e.target.files![0])} className="hidden" />
              {uploadedFile ? (
                <>
                  <FileText className="h-10 w-10 text-[#cba6f7] mb-2" />
                  <p className="text-[#cdd6f4] max-w-full truncate">{uploadedFile.name}</p>
                  <p className="text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p className="text-[#89b4fa] text-sm mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-[#f2cdcd] mb-2" />
                  <p className="text-[#cdd6f4] font-medium">Drop your file here or click to browse</p>
                  <p className="text-sm text-[#f2cdcd]">Supports TXT, PDF, DOC, DOCX (max 10MB)</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
              <FileText className="h-5 w-5 text-[#89b4fa]" /> or Write Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste or type your content here..."
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              className="h-48 bg-[#1e1e2e] border border-[#313244] text-[#cdd6f4] placeholder:text-[#f2cdcd] resize-none rounded-md p-4"
            />
            <p className="text-sm text-[#f2cdcd] mt-2">{textInput.length} characters</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
        <Button onClick={handleSummarize} disabled={!hasContent || isSummarizing} className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg">
          <Sparkles className="h-5 w-5 mr-2" /> {isSummarizing ? "Processing..." : "Generate Summary"}
        </Button>

        <Button onClick={handleGenerateQuiz} disabled={!hasContent || isGeneratingQuiz} variant="outline" className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg">
          <BookOpen className="h-5 w-5 mr-2" /> {isGeneratingQuiz ? "Processing..." : "Generate Quiz"}
        </Button>

        <Button onClick={handleGenerateTopicQuiz} disabled={!textInput.trim() || isGeneratingTopicQuiz} className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg">
          <Sparkles className="h-5 w-5 mr-2" /> {isGeneratingTopicQuiz ? "Processing..." : "Generate Topic Quiz"}
        </Button>
      </div>

      {!hasContent && (
        <p className="text-[#f2cdcd] mt-2 text-sm text-center">Upload a document or enter text to get started</p>
      )}

      {/* Dialog */}
      <Dialog open={dialogData.open} onOpenChange={open => setDialogData(prev => ({ ...prev, open }))}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1e1e2e] text-[#cdd6f4]">
          <DialogHeader>
            <DialogTitle className="text-[#cba6f7]">{dialogData.title}</DialogTitle>
            {dialogData.title === "Quiz" && typeof dialogData.content === 'object' && 'questions' in dialogData.content && Array.isArray(dialogData.content.questions) ? (
              <InteractiveQuiz questions={dialogData.content.questions} />
            ) : (
              <pre className="whitespace-pre-wrap text-sm mt-2">
                {typeof dialogData.content === 'string' ? dialogData.content : JSON.stringify(dialogData.content, null, 2)}
              </pre>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesmithAI;