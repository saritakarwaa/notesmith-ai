import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

const allowedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const maxSize = 10 * 1024 * 1024; // 10 MB

export const validateFile = (file: File): boolean => {
  if (
    !allowedTypes.includes(file.type) &&
    !file.name.match(/\.(txt|pdf|doc|docx)$/i)
  ) {
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

  toast({
    title: "File uploaded successfully",
    description: `${file.name} is ready for processing.`,
  });

  return true;
};

