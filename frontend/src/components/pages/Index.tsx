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

const NotesmithAI = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const { toast } = useToast();
  const baseUrl="http://localhost:3000/api"

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type and size
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a TXT, PDF, DOC, or DOCX file.",
        
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          
        });
        return;
      }

      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing.`
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // Handle file validation and setting directly
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
        toast({
          title: "Unsupported file type",
          description: "Please upload a TXT, PDF, DOC, or DOCX file.",
          
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
         
        });
        return;
      }

      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing.`
      });
    }
  };

  const hasContent = uploadedFile || textInput.trim().length > 0;

  const handleSummarize = async () => {
    if (!hasContent) return;
    
    setIsProcessing(true);
    const formData=new FormData();
    if(uploadedFile) formData.append('file',uploadedFile)
    else formData.append('text',textInput)
    try {
      const response=await fetch(`${baseUrl}/summarize`,{
        method:'POST',
        body:formData,
      })
      const data=await response.json();
      if (response.ok && data.summary) {
        setDialogTitle('Summary');
        setDialogContent(data.summary);
        setDialogOpen(true);
      } else {
        toast({ title: "Summarization Failed", description: data.message || "No summary returned." });
      }

    } catch (error) {
      toast({
        title: "Error generating summary",
        description: "Please try again later.",
       
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!hasContent) return;
    
    setIsProcessing(true);
    const formData=new FormData()
    if(uploadedFile) formData.append('file',uploadedFile)
    else formData.append('text',textInput)
    try {
      const response=await fetch(`${baseUrl}/generate-quiz`,{
        method:'POST',
        body:formData,
      })
      const data=await response.json()
      if(response.ok && data.quiz){
        setDialogTitle('Generated Quiz')
        setDialogContent(data.quiz)
        setDialogOpen(true)
      }
      else {
        toast({ title: "Quiz Generation Failed", description: data.message || "No quiz returned." });
      }
    } catch (error) {
      toast({
        title: "Error generating quiz",
        description: "Please try again later.",
       
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-2 md:gap-3">
          <FileText className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Notesmith AI
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
          Transform your content with AI-powered summarization and quiz generation
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* File Upload Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" />
                Upload Document
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-accent transition-colors h-40 sm:h-44 md:h-48 flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadedFile ? (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-foreground font-medium">{uploadedFile.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-accent text-sm mt-2">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground font-medium mb-1">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Supports TXT, PDF, DOC, DOCX (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Text Input Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Write Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste or type your content here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="h-40 sm:h-44 md:h-48 bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
              <p className="text-muted-foreground text-sm mt-2">
                {textInput.length} characters
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-2">
          <Button
            onClick={handleSummarize}
            disabled={!hasContent || isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-base md:text-lg"
            size="lg"
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Generate Summary'}
          </Button>

          <Button
            onClick={handleGenerateQuiz}
            disabled={!hasContent || isProcessing}
            variant="outline"
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 text-base md:text-lg"
            size="lg"
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            {isProcessing ? 'Processing...' : 'Create Quiz'}
          </Button>
        </div>

        {/* Status Message */}
        {!hasContent && (
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Upload a document or enter text to get started
            </p>
          </div>
        )}
      </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              <pre className="whitespace-pre-wrap text-sm mt-2 text-foreground">
                {dialogContent}
              </pre>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      </div>
  );
};

export default NotesmithAI;