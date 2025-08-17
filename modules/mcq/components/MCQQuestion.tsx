import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { CheckCircle, XCircle } from "lucide-react";

interface MCQQuestionProps {
  question: any;
  onAnswer?: (selectedOption: number) => void;
  showAnswer?: boolean;
  disabled?: boolean;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  onAnswer,
  showAnswer = false,
  disabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Handle different options formats
  let options: string[] = [];
  try {
    if (typeof question.options === "string") {
      options = JSON.parse(question.options);
    } else if (Array.isArray(question.options)) {
      options = question.options;
    } else {
      options = [];
    }
  } catch (error) {
    console.error("Error parsing MCQ options:", error);
    options = [];
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (disabled) return;

    setSelectedOption(optionIndex);
    onAnswer?.(optionIndex);
  };

  const isCorrect = selectedOption === question.correctAnswer;
  const showResult = showAnswer && selectedOption !== null;

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Question</h3>
        <p className="text-gray-700">{question.question}</p>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(index)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === index
                ? showResult
                  ? isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                  : "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index
                      ? showResult
                        ? isCorrect
                          ? "border-green-500 bg-green-500"
                          : "border-red-500 bg-red-500"
                        : "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedOption === index && (
                    <span className="text-white text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  )}
                </div>
                <span className="text-gray-700">{option}</span>
              </div>
              {showResult && selectedOption === index && (
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">
            {isCorrect ? "Correct!" : "Incorrect"}
          </h4>
          {question.explanation && (
            <p className="text-gray-700">{question.explanation}</p>
          )}
          {!isCorrect && (
            <p className="text-gray-600 mt-2">
              Correct answer: {String.fromCharCode(65 + question.correctAnswer)}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
