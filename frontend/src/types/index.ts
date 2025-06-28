export type QuizQuestion = {
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
};

export type Quiz = {
  questions: QuizQuestion[];
};

export type DialogData = {
  open: boolean;
  title: string;
  content: string | Quiz;
};
