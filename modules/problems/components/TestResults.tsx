import React from "react";
import { Card } from "@/shared/components/Card";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface TestCase {
  input: string;
  expected: string;
}

interface Submission {
  id: string;
  status: string;
  testResults?: string;
}

interface TestResultsProps {
  results?: TestResult[];
  status?: string;
  passedTests?: number;
  totalTests?: number;
  submission?: Submission;
  testCases?: TestCase[];
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  status,
  passedTests,
  totalTests,
  submission,
  testCases,
}) => {
  // Parse test results from submission if provided
  const parsedResults: TestResult[] = results || [];
  const currentStatus = status || submission?.status || "unknown";
  const currentPassedTests = passedTests || 0;
  const currentTotalTests = totalTests || testCases?.length || 0;

  const statusColors = {
    accepted: "text-green-600 bg-green-100",
    wrong_answer: "text-red-600 bg-red-100",
    time_limit: "text-yellow-600 bg-yellow-100",
    runtime_error: "text-red-600 bg-red-100",
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
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[currentStatus as keyof typeof statusColors] ||
            "text-gray-600 bg-gray-100"
          }`}
        >
          {statusIcons[currentStatus as keyof typeof statusIcons] || (
            <XCircle className="w-5 h-5" />
          )}
          <span className="capitalize">{currentStatus.replace("_", " ")}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Passed: {currentPassedTests}/{currentTotalTests}
          </span>
          <span>
            {currentTotalTests > 0
              ? Math.round((currentPassedTests / currentTotalTests) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                currentTotalTests > 0
                  ? (currentPassedTests / currentTotalTests) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {parsedResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.passed
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Test Case {result.testCase}</span>
              {result.passed ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium">Input:</span>{" "}
                <code className="bg-gray-100 px-1 rounded">{result.input}</code>
              </div>
              <div>
                <span className="font-medium">Expected:</span>{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {result.expected}
                </code>
              </div>
              <div>
                <span className="font-medium">Actual:</span>{" "}
                <code className="bg-gray-100 px-1 rounded">
                  {result.actual}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
