'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { MCQQuestion } from '@/shared/components/MCQQuestion';
import { MCQQuestion as MCQQuestionType } from '@/shared/types/common';

export default function MCQPage() {
  const params = useParams();
  const [question, setQuestion] = useState<MCQQuestionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/mcq/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setQuestion(data.data);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== undefined && question) {
      setSubmitted(true);
      setCorrect(selectedAnswer === question.correctAnswer);
    }
  };

  const handleNext = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading question..." />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Not Found</h2>
          <p className="text-gray-600 mb-6">The question you're looking for doesn't exist.</p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </Button>
        </div>

        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">MCQ Question</h1>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {question.category}
              </span>
            </div>
          </div>

          <MCQQuestion
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            submitted={submitted}
            correct={correct}
          />

          <div className="mt-8 flex justify-center space-x-4">
            {!submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === undefined}
                size="lg"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                size="lg"
              >
                Continue
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
