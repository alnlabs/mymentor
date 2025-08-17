"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { CheckCircle, XCircle } from "lucide-react";

interface MCQQuestionProps {
  question: any;
  onSubmit: (selectedAnswer: number) => void;
  isSubmitted?: boolean;
  selectedAnswer?: number;
}

export const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  onSubmit,
  isSubmitted = false,
  selectedAnswer,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(
    selectedAnswer || null
  );

  // Handle different options formats safely
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

  const handleSubmit = () => {
    if (currentAnswer !== null) {
      onSubmit(currentAnswer);
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {question.question}
        </h2>

        <div className="space-y-3">
          {options.map((option: string, index: number) => (
            <label
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                currentAnswer === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${
                isSubmitted && index === question.correctAnswer
                  ? "border-green-500 bg-green-50"
                  : ""
              } ${
                isSubmitted &&
                currentAnswer === index &&
                index !== question.correctAnswer
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
            >
              <input
                type="radio"
                name="mcq-answer"
                value={index}
                checked={currentAnswer === index}
                onChange={() => setCurrentAnswer(index)}
                disabled={isSubmitted}
                className="mr-3"
              />
              <span className="text-gray-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {!isSubmitted && (
        <Button onClick={handleSubmit} disabled={currentAnswer === null}>
          Submit Answer
        </Button>
      )}

      {isSubmitted && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h4
              className={`font-semibold ${
                isCorrect ? "text-green-800" : "text-red-800"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </h4>
            {question.explanation && (
              <p className="text-sm mt-2 text-gray-700">
                {question.explanation}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
