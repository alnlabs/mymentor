import React from 'react';
import { Card } from '@/shared/components/Card';
import { MCQQuestion } from '@/shared/types/common';

interface MCQCardProps {
  question: MCQQuestion;
  onSelect: (question: MCQQuestion) => void;
}

export const MCQCard: React.FC<MCQCardProps> = ({ question, onSelect }) => {
  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(question)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {question.question}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {question.category}
        </span>
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={(e) => { e.stopPropagation(); onSelect(question); }}
        >
          Answer →
        </button>
      </div>
    </Card>
  );
};
