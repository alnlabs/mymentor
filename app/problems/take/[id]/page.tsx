"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { CodeEditor } from "@/modules/problems/components/CodeEditor";
import { TestResults } from "@/modules/problems/components/TestResults";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ApiErrorBoundary } from "@/shared/components/ApiErrorBoundary";
import {
  Code,
  Play,
  Save,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Zap,
  Lightbulb,
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
}

interface TestCase {
  input: string;
  output: string;
  description?: string;
}

interface Submission {
  id: string;
  code: string;
  language: string;
  status: string;
  score: number;
  runtime?: number;
  memory?: number;
  testResults?: any[];
}

export default function TakeProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (problemId) {
      loadProblem();
    }
  }, [problemId]);

  const loadProblem = async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}`);
      const data = await response.json();

      if (data.success) {
        setProblem(data.data);
        // Parse test cases from JSON string
        try {
          const parsedTestCases = JSON.parse(data.data.testCases);
          setTestCases(parsedTestCases);
        } catch (e) {
          console.error("Error parsing test cases:", e);
          setTestCases([]);
        }
      } else {
        console.error("Failed to load problem:", data.error);
      }
    } catch (error) {
      console.error("Error loading problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const runTests = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setTesting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          code,
          language,
          testOnly: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmission(data.data);
      } else {
        console.error("Test execution failed:", data.error);
      }
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setTesting(false);
    }
  };

  const submitSolution = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId,
          code,
          language,
          testOnly: false,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmission(data.data);
        // Show success message
        alert("Solution submitted successfully!");
      } else {
        console.error("Submission failed:", data.error);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetCode = () => {
    setCode("");
    setSubmission(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ErrorBoundary componentName="TakeProblemPage">
      <ApiErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Header */}
          <div className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/problems")}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Problems</span>
                  </Button>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-2">
                    <Code className="w-6 h-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">
                      {problem?.title || "Loading Problem..."}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {problem?.difficulty || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {problem?.category || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loading size="lg" />
                  <p className="mt-4 text-gray-600">Loading problem...</p>
                </div>
              </div>
            ) : !problem ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Problem Not Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The problem you're looking for doesn't exist.
                  </p>
                  <Button onClick={() => router.push("/problems")}>
                    Back to Problems
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Problem Description */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="prose prose-lg max-w-none">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Problem Description
                      </h2>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {problem.description}
                      </div>
                    </div>
                  </Card>

                  {/* Test Cases */}
                  {testCases.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        Test Cases
                      </h2>
                      <div className="space-y-4">
                        {testCases.map((testCase, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Input:
                                </h4>
                                <pre className="bg-white p-2 rounded border text-sm overflow-x-auto">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Expected Output:
                                </h4>
                                <pre className="bg-white p-2 rounded border text-sm overflow-x-auto">
                                  {testCase.output}
                                </pre>
                              </div>
                            </div>
                            {testCase.description && (
                              <p className="text-sm text-gray-600 mt-2">
                                {testCase.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Hints */}
                  {problem.hints && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                          Hints
                        </h2>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowHints(!showHints)}
                        >
                          {showHints ? "Hide" : "Show"} Hints
                        </Button>
                      </div>
                      {showHints && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-gray-700">{problem.hints}</p>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Solution */}
                  {showSolution && problem.solution && (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                        Solution
                      </h2>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{problem.solution}</pre>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Code Editor */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Code Editor
                      </h2>
                      <div className="flex items-center space-x-2">
                        <select
                          value={language}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                    </div>

                    <CodeEditor
                      code={code}
                      language={language}
                      onCodeChange={handleCodeChange}
                      onChange={handleCodeChange}
                      onRun={runTests}
                      isRunning={testing}
                      height="400px"
                    />
                  </Card>

                  {/* Action Buttons */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={resetCode}
                        disabled={submitting || testing}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>

                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={runTests}
                          disabled={submitting || testing || !code.trim()}
                          variant="outline"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {testing ? "Running..." : "Run Tests"}
                        </Button>

                        <Button
                          onClick={submitSolution}
                          disabled={submitting || testing || !code.trim()}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {submitting ? "Submitting..." : "Submit Solution"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Test Results */}
                  {submission && (
                    <Card className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Test Results
                      </h2>
                      <TestResults
                        submission={submission as any}
                        testCases={testCases as any}
                      />
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </ApiErrorBoundary>
    </ErrorBoundary>
  );
}
