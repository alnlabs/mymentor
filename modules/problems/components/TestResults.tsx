import React from 'react';
import { Card } from '@/shared/components/Card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface TestResultsProps {
  results: TestResult[];
  status: string;
  passedTests: number;
  totalTests: number;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  status,
  passedTests,
  totalTests,
}) => {
  const statusColors = {
    accepted: 'text-green-600 bg-green-100',
    wrong_answer: 'text-red-600 bg-red-100',
    time_limit: 'text-yellow-600 bg-yellow-100',
    runtime_error: 'text-red-600 bg-red-100',
  };

  const statusIcons = {
    accepted: <CheckCircle className="w-5 h-5" />,
    wrong_answer: <XCircle className="w-5 h-5" />,
    time_limit: <Clock className="w-5 h-5" />,
    runtime_error: <XCircle className="w-5 h-5" />,
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
          {statusIcons[status as keyof typeof statusIcons]}
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Passed: {passedTests}/{totalTests}</span>
          <span>{Math.round((passedTests / totalTests) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(passedTests / totalTests) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className={`p-3 rounded-lg border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Test Case {result.testCase}</span>
              {result.passed ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Input:</span> <code className="bg-gray-100 px-1 rounded">{result.input}</code></div>
              <div><span className="font-medium">Expected:</span> <code className="bg-gray-100 px-1 rounded">{result.expected}</code></div>
              <div><span className="font-medium">Actual:</span> <code className="bg-gray-100 px-1 rounded">{result.actual}</code></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
