'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { InterviewTemplate } from '@/shared/types/common';
import { Clock, Users, Target, Star } from 'lucide-react';

interface InterviewCardProps {
  template: InterviewTemplate;
  onSelect: (template: InterviewTemplate) => void;
  isAdmin?: boolean;
}

export function InterviewCard({ template, onSelect, isAdmin = false }: InterviewCardProps) {
  const router = useRouter();
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'fullstack': return '🔄';
      case 'ml': return '🤖';
      case 'mobile': return '📱';
      default: return '💻';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(template.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.category}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
          {template.difficulty}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{template.duration} min</span>
          </div>
          {template.companies && template.companies.length > 0 && (
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{template.companies.length} companies</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">4.8</span>
        </div>
      </div>

      {template.companies && template.companies.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Target Companies:</p>
          <div className="flex flex-wrap gap-1">
            {template.companies.slice(0, 3).map((company, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {company}
              </span>
            ))}
            {template.companies.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                +{template.companies.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        {isAdmin ? (
          <Button
            onClick={() => onSelect(template)}
            className="flex-1"
            variant="primary"
          >
            Edit Template
          </Button>
        ) : (
          <Button
            onClick={() => router.push(`/interviews/take/${template.id}`)}
            className="flex-1"
            variant="primary"
          >
            Take Interview
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            className="px-4"
          >
            Preview
          </Button>
        )}
      </div>
    </Card>
  );
}
