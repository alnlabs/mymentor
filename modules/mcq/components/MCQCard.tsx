import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Clock, Tag, Users, TrendingUp } from "lucide-react";

interface MCQCardProps {
  question: any;
  onSelect: (question: any) => void;
}

export const MCQCard: React.FC<MCQCardProps> = ({ question, onSelect }) => {
  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  const getDifficultyColor = (difficulty: string) => {
    return (
      difficultyColors[difficulty.toLowerCase()] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(question)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {question.question}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            {question.category && (
              <span className="flex items-center space-x-1">
                <Tag className="w-4 h-4" />
                <span>{question.category}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          {question.explanation && (
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>Has explanation</span>
            </span>
          )}
          {question.companies && (
            <span className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Company specific</span>
            </span>
          )}
        </div>
        <Button size="sm" variant="outline">
          Start
        </Button>
      </div>
    </Card>
  );
};
