import React from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Problem } from '@/shared/types/common';

interface ProblemCardProps {
  problem: Problem;
  onSelect: (problem: Problem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSelect }) => {
  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect(problem)}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {problem.description ? problem.description.substring(0, 150) + '...' : 'No description available'}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {problem.category}
        </span>
        <Button size="sm" onClick={(e) => { e.stopPropagation(); onSelect(problem); }}>
          Solve
        </Button>
      </div>
    </Card>
  );
};
