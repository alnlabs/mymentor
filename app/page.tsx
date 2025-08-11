'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { AuthButton } from '@/shared/components/AuthButton';
import { useAuthContext } from '@/shared/components/AuthContext';
import { ProblemCard } from '@/modules/problems/components/ProblemCard';
import { MCQCard } from '@/modules/mcq/components/MCQCard';
import { Problem, MCQQuestion } from '@/shared/types/common';

export default function HomePage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'problems' | 'mcq'>('problems');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [mcqQuestions, setMCQQuestions] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [selectedMCQ, setSelectedMCQ] = useState<MCQQuestion | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [problemsRes, mcqRes] = await Promise.all([
        fetch('/api/problems'),
        fetch('/api/mcq')
      ]);
      
      const problemsData = await problemsRes.json();
      const mcqData = await mcqRes.json();
      
      if (problemsData.success) setProblems(problemsData.data);
      if (mcqData.success) setMCQQuestions(mcqData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    // Navigate to problem page
    window.location.href = `/problems/${problem.id}`;
  };

  const handleMCQSelect = (question: MCQQuestion) => {
    setSelectedMCQ(question);
    // Navigate to MCQ page
    window.location.href = `/mcq/${question.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading MyMentor..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                MyMentor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <AuthButton />
              {user && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/admin'}
                >
                  Admin
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Personal Interview Mentor
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master technical interviews with personalized coding problems and MCQ questions. 
            Practice, learn, and succeed with MyMentor by your side.
          </p>
          {!user ? (
            <div className="flex justify-center space-x-4">
              <AuthButton />
            </div>
          ) : (
            <div className="flex justify-center space-x-4">
              <Button size="lg" onClick={() => setActiveTab('problems')}>
                Start Coding
              </Button>
              <Button variant="outline" size="lg" onClick={() => setActiveTab('mcq')}>
                Take MCQ Quiz
              </Button>
            </div>
          )}
        </div>

        {user && (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
              <button
                onClick={() => setActiveTab('problems')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'problems'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Coding Problems ({problems.length})
              </button>
              <button
                onClick={() => setActiveTab('mcq')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'mcq'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                MCQ Questions ({mcqQuestions.length})
              </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTab === 'problems' ? (
                problems.map((problem) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    onSelect={handleProblemSelect}
                  />
                ))
              ) : (
                mcqQuestions.map((question) => (
                  <MCQCard
                    key={question.id}
                    question={question}
                    onSelect={handleMCQSelect}
                  />
                ))
              )}
            </div>
          </>
        )}

        {!user && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">M</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4">Join MyMentor Today</h3>
              <p className="text-gray-600 mb-6">
                Sign in to access personalized coding problems and MCQ questions designed to help you ace technical interviews.
              </p>
              <AuthButton />
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">💻</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Coding Problems</h3>
            <p className="text-gray-600 text-sm">
              Practice with real-world coding challenges and improve your problem-solving skills.
            </p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">❓</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">MCQ Questions</h3>
            <p className="text-gray-600 text-sm">
              Test your knowledge with carefully curated multiple-choice questions.
            </p>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your performance and see your improvement over time.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
