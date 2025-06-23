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
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDispatch } from 'react-redux';
import { setQuiz, setSummary } from '@/features/notesSlice';

type Quiz = {
  questions: {
    question: string;
    options: {
      a: string;
      b: string;
      c: string;
      d: string;
    };
    correctAnswer: string;
  }[];
};

const NotesmithAI = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogData, setDialogData] = useState<{
          open: boolean;title: string;content: string|Quiz;}>({
          open: false,title: '',content: '',});
  const { toast } = useToast();
  const dispatch=useDispatch()
  const baseUrl="http://localhost:3000/api"

  const validateAndHandleFile = (file: File): boolean => {
      const allowedTypes = [
        'text/plain',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const maxSize = 10 * 1024 * 1024;

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a TXT, PDF, DOC, or DOCX file.",
        });
        return false;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
        });
        return false;
      }

      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing.`,
      });

      return true;
    };

      const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file) validateAndHandleFile(file)
      };

      const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
      };

      const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if(file) validateAndHandleFile(file)
      };
  const buildFormData = () => {
      const formData = new FormData();
      if (uploadedFile) formData.append("file", uploadedFile);
      else formData.append("text", textInput);
      return formData;
  };

  const hasContent = uploadedFile || textInput.trim().length > 0;

  const handleSummarize = async () => {
    if (!hasContent) return;
    
    setIsSummarizing(true)
    const formData=buildFormData()
    try {
      const response=await fetch(`${baseUrl}/summarize`,{
        method:'POST',
        body:formData,
      })
      const data=await response.json();
      if (response.ok && data.summary) {
        dispatch(setSummary(data.summary))
        setDialogData({
          open: true,
          title: 'Summary',
          content: data.summary,
        });
      } else {
        setDialogData({ open: true, title: "Error", content: data.message });
        toast({ title: "Summarization Failed", description: data.message || "No summary returned." });
      }

    } catch (error) {
      toast({
        title: "Error generating summary",
        description: "Please try again later.",
       
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!hasContent) return;
    
    setIsGeneratingQuiz(true);
    const formData=buildFormData()
    try {
      const response=await fetch(`${baseUrl}/generate-quiz`,{
        method:'POST',
        body:formData,
      })
      const data=await response.json()
      if(response.ok && data.quiz){
        dispatch(setQuiz(data.quiz))
        setDialogData({
          open: true,
          title: 'Quiz',
          content: data.quiz,
        });
      }
      else {
        setDialogData({ open: true, title: "Error", content: data.message });
        toast({ title: "Quiz Generation Failed", description: data.message || "No quiz returned." });
      }
    } catch (error) {
      toast({
        title: "Error generating quiz",
        description: "Please try again later.",
       
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-10 px-4 sm:px-6 md:px-8 lg:px-10 flex flex-col items-center bg-[#1e1e2e] text-[#cdd6f4]">
  {/* Header */}
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold flex items-center justify-center gap-2 text-[#cba6f7]">
      <FileText className="h-7 w-7" />
      Notesmith AI
    </h1>
    <p className="mt-2 text-base text-[#f2cdcd]">
      Transform your content with AI-powered summarization and quiz generation
    </p>
  </div>

  {/* Upload + Text Input */}
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {/* Upload */}
    <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
          <Upload className="h-5 w-5 text-[#89b4fa]" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-[#313244] rounded-md p-6 h-48 cursor-pointer text-center flex flex-col justify-center items-center hover:border-[#f5e0dc] transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
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

    {/* Text Input */}
    <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
          <FileText className="h-5 w-5 text-[#89b4fa]" />
          or Write Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste or type your content here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="h-48 bg-[#1e1e2e] border border-[#313244] text-[#cdd6f4] placeholder:text-[#f2cdcd] resize-none rounded-md p-4"
        />
        <p className="text-sm text-[#f2cdcd] mt-2">{textInput.length} characters</p>
      </CardContent>
    </Card>
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
    <Button
      onClick={handleSummarize}
      disabled={!hasContent || isSummarizing}
      className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg"
    >
      <Sparkles className="h-5 w-5 mr-2" />
      {isSummarizing ? "Processing..." : "Generate Summary"}
    </Button>

    <Button
      onClick={handleGenerateQuiz}
      disabled={!hasContent || isGeneratingQuiz}
      variant="outline"
      className="border border-[#313244] text-white hover:bg-[#313244] px-6 py-3 rounded-md text-lg"
    >
      <BookOpen className="h-5 w-5 mr-2" />
      {isGeneratingQuiz ? "Processing..." : "Create Quiz"}
    </Button>
  </div>

  {/* Hint */}
  {!hasContent && (
    <p className="text-[#f2cdcd] mt-2 text-sm text-center">
      Upload a document or enter text to get started
    </p>
  )}

  {/* Dialog */}
  <Dialog open={dialogData.open} onOpenChange={(open) => setDialogData(prev => ({ ...prev, open }))}>
    <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1e1e2e] text-[#cdd6f4]">
      <DialogHeader>
        <DialogTitle className="text-[#cba6f7]">{dialogData.title}</DialogTitle>
        <DialogDescription className="mt-4 space-y-4">
          {typeof dialogData.content === 'string' ? (
            <p>{dialogData.content}</p>
          ) : 'questions' in dialogData.content ? (
            <div className="space-y-4">
              {dialogData.content.questions.map((q, index) => (
                <div key={index}>
                  <p className="font-medium text-[#f5e0dc]">
                    {index + 1}. {q.question}
                  </p>
                  <ul className="list-disc pl-6 text-sm text-[#f2cdcd]">
                    {Object.entries(q.options).map(([key, option]) => (
                      <li key={key}>
                        <span className={q.correctAnswer === key ? "font-bold text-[#b4befe]" : ""}>
                          ({key}) {option}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">Unsupported format</p>
          )}
        </DialogDescription>

      </DialogHeader>
    </DialogContent>
  </Dialog>
</div>

  );
};

export default NotesmithAI;