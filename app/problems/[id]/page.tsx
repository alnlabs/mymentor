'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Loading } from '@/shared/components/Loading';
import { CodeEditor } from '@/modules/problems/components/CodeEditor';
import { TestResults } from '@/modules/problems/components/TestResults';
import { Problem } from '@/shared/types/common';

export default function ProblemPage() {
  const params = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  \n}');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      fetchProblem(params.id as string);
    }
  }, [params.id]);

  const fetchProblem = async (id: string) => {
    try {
      const response = await fetch(`/api/problems/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProblem(data.data);
      } else {
        console.error('Failed to fetch problem:', data.error);
      }
    } catch (error) {
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!problem) return;

    setIsRunning(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          userId: 'temp-user-id', // Will be replaced with actual user ID
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        console.error('Failed to run code:', data.error);
      }
    } catch (error) {
      console.error('Error running code:', error);
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading problem..." />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <h2 className="text-xl font-semibold text-red-600">Problem not found</h2>
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
              <h1 className="text-xl font-semibold text-gray-900">{problem.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                problem.difficulty === 'easy' ? 'text-green-600 bg-green-100' :
                problem.difficulty === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {problem.category}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Problem Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
              </div>
            </Card>

            {problem.hints && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Hints</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {JSON.parse(problem.hints).map((hint: string, index: number) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </Card>
            )}

            {results && (
              <TestResults
                results={results.testResults}
                status={results.status}
                passedTests={results.passedTests}
                totalTests={results.totalTests}
              />
            )}
          </div>

          {/* Code Editor */}
          <div>
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={setCode}
              onRun={handleRunCode}
              isRunning={isRunning}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
