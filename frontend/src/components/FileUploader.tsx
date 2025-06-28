import React, { useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { validateFile } from "./utils/file";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileUploader: React.FC<Props> = ({ file, setFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) setFile(file);
  };

  return (
    <Card className="bg-[#1e1e2e] border border-[#313244] shadow-none">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-[#cdd6f4]">
          <Upload className="h-5 w-5 text-[#89b4fa]" /> Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-[#313244] rounded-md p-6 h-48 cursor-pointer text-center flex flex-col justify-center items-center hover:border-[#f5e0dc] transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={(e) => handleFileSelect(e.target.files![0])}
            className="hidden"
          />
          {file ? (
            <>
              <FileText className="h-10 w-10 text-[#cba6f7] mb-2" />
              <p className="text-[#cdd6f4] max-w-full truncate">{file.name}</p>
              <p className="text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
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
  );
};

export default FileUploader;