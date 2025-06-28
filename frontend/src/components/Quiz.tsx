import  { useState } from 'react';
import type{ QuizQuestion } from '@/types';

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

export default InteractiveQuiz;
