import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import TextInputArea from "@/components/TextInput";
import ActionButtons from "@/components/ActionButtons";
import DialogViewer from "../DialogViewer";
import type { DialogData } from "@/types";
import { useNotesmithApi } from "@/hooks/useApi";
import { clearFile, loadFile, loadText, saveFile, saveText } from "../utils/storage";


const NotesmithAI: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [dialogData, setDialogData] = useState<DialogData>({ open: false, title: "", content: "" });
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);

  useEffect(()=>{
    loadText().then(setText)
  },[])
  useEffect(()=>{
    saveText(text)
  },[text])
  useEffect(()=>{
    loadFile().then((f)=>{
      if(f) setFile(f)
    })
  },[])
  useEffect(()=>{
    if(file) saveFile(file)
    else clearFile()
  },[file])

  const { summarize, generateQuiz, generateTopicQuiz } = useNotesmithApi();

  const buildFormData = (): FormData => {
    const fd = new FormData();
    if (file) fd.append("file", file);
    else fd.append("text", text);
    return fd;
  };

 

  const hasContent = file || text.trim().length > 0;

  const handleSummarize = async () => {
    if (!hasContent) return;
      setSummarizeLoading(true);
    const summary=await summarize(buildFormData());
    if(summary) setDialogData({ open: true, title: "Summary", content: summary});
    setSummarizeLoading(false)
  };

  const handleQuiz = async () => {
    if (!hasContent) return;
      setQuizLoading(true);
    const quiz=await generateQuiz(buildFormData());
    if(quiz) setDialogData({ open: true, title: "Quiz", content: quiz });
    setQuizLoading(false)
  };

  const handleTopicQuiz = async () => {
    if (!text.trim()) return;
    setTopicLoading(true)
    const quiz=await generateTopicQuiz(text);
    if(quiz) setDialogData({ open: true, title: "Quiz", content:quiz });
    setTopicLoading(false)
  };

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

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FileUploader file={file} setFile={setFile} />
        <TextInputArea text={text} setText={setText} />
      </div>

      <ActionButtons
        disabled={!hasContent}
        summarizeLoading={summarizeLoading}
        quizLoading={quizLoading}
        topicLoading={topicLoading}
        onSummarize={handleSummarize}
        onQuiz={handleQuiz}
        onTopicQuiz={handleTopicQuiz}
        disableTopicQuiz={!text.trim()}
      />

      {!hasContent && <p className="text-[#f2cdcd] mt-2 text-sm text-center">Upload a document or enter text to get started</p>}

      <DialogViewer dialogData={dialogData} setDialogData={setDialogData} />
    </div>
  );
};

export default NotesmithAI;
