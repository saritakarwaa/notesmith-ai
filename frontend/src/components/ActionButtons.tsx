import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen } from "lucide-react";
interface Props {
  disabled: boolean;
  summarizeLoading: boolean;
  quizLoading: boolean;
  topicLoading: boolean;
  onSummarize: () => void;
  onQuiz: () => void;
  onTopicQuiz: () => void;
  disableTopicQuiz: boolean;
}

const ActionButtons: React.FC<Props> = ({
  disabled,
  onSummarize,
  onQuiz,
  summarizeLoading,
  quizLoading,
  onTopicQuiz,
  disableTopicQuiz,
  topicLoading,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
    <Button
        onClick={onSummarize}
        disabled={disabled || summarizeLoading}
        className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg"
        >
        <Sparkles className="h-5 w-5 mr-2" />
        {summarizeLoading ? "Processing..." : "Generate Summary"}
        </Button>

        <Button
        onClick={onQuiz}
        disabled={disabled || quizLoading}
        variant="outline"
        className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg"
        >
        <BookOpen className="h-5 w-5 mr-2" />
        {quizLoading ? "Processing..." : "Generate Quiz"}
        </Button>

        <Button
        onClick={onTopicQuiz}
        disabled={disableTopicQuiz || topicLoading}
        className="bg-[#b4befe] hover:bg-[#cba6f7] text-white px-6 py-3 rounded-md text-lg"
        >
        <Sparkles className="h-5 w-5 mr-2" />
        {topicLoading ? "Processing..." : "Generate Topic Quiz"}
        </Button>

    </div>
);

export default ActionButtons;