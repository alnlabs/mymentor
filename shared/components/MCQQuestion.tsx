'use client';

import React from 'react';
import { MCQQuestion as MCQQuestionType } from '@/shared/types/common';

interface MCQQuestionProps {
  question: MCQQuestionType;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  submitted?: boolean;
  correct?: boolean;
}

export function MCQQuestion({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  submitted = false,
  correct = false 
}: MCQQuestionProps) {
  const options = JSON.parse(question.options || '[]');

  const getOptionStyle = (index: number) => {
    if (!submitted) {
      return selectedAnswer === index 
        ? 'bg-blue-100 border-blue-500 text-blue-900' 
        : 'bg-white border-gray-300 hover:bg-gray-50';
    }

    if (index === question.correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-900';
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-900';
    }

    return 'bg-gray-100 border-gray-300 text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => !submitted && onAnswerSelect(index)}
            disabled={submitted}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
              getOptionStyle(index)
            } ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === index 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Result */}
      {submitted && (
        <div className={`p-4 rounded-lg ${
          correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl ${correct ? 'text-green-600' : 'text-red-600'}`}>
              {correct ? '✅' : '❌'}
            </span>
            <div>
              <h4 className={`font-semibold ${
                correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {correct ? 'Correct!' : 'Incorrect'}
              </h4>
              <p className={`text-sm ${
                correct ? 'text-green-700' : 'text-red-700'
              }`}>
                {correct 
                  ? 'Great job! You got it right.' 
                  : `The correct answer is: ${options[question.correctAnswer]}`
                }
              </p>
            </div>
          </div>
          
          {question.explanation && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h5 className="font-medium text-gray-900 mb-2">Explanation:</h5>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {question.tags && (
        <div className="flex flex-wrap gap-2">
          {JSON.parse(question.tags).map((tag: string, index: number) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
