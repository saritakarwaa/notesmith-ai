import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import InteractiveQuiz from './Quiz';
import type { DialogData } from '@/types';

const DialogViewer = ({ dialogData, setDialogData }: {
  dialogData: DialogData;
  setDialogData: React.Dispatch<React.SetStateAction<DialogData>>;
}) => (
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
);

export default DialogViewer;