'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { MCQQuestionComponent } from '@/modules/mcq/components/MCQQuestion';
import { MCQQuestion } from '@/shared/types/common';

export default function MCQPage() {
  const params = useParams();
  const [question, setQuestion] = useState<MCQQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchQuestion(params.id as string);
    }
  }, [params.id]);

  const fetchQuestion = async (id: string) => {
    try {
      const response = await fetch(`/api/mcq/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestion(data.data);
      } else {
        console.error('Failed to fetch question:', data.error);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer: number) => {
    setSelectedAnswer(answer);
    setIsSubmitted(true);

    // Here you would typically save the answer to the database
    // For now, we'll just show the result
    try {
      // Save user progress
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mcqId: question?.id,
          questionType: 'mcq',
          selectedAnswer: answer,
          isCorrect: answer === question?.correctAnswer,
          userId: 'temp-user-id', // Will be replaced with actual user ID
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
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
        <Card>
          <h2 className="text-xl font-semibold text-red-600">Question not found</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                ← Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">MCQ Question</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                question.difficulty === 'easy' ? 'text-green-600 bg-green-100' :
                question.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100'
              }`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {question.category}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MCQQuestionComponent
          question={question}
          onSubmit={handleSubmit}
          isSubmitted={isSubmitted}
          selectedAnswer={selectedAnswer}
        />

        {isSubmitted && (
          <div className="mt-6 flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Questions
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Home
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
