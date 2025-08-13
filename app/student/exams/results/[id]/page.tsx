"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { StudentHeader } from "@/shared/components/StudentHeader";
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  BookOpen,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

interface ExamResult {
  id: string;
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  points: number;
  question: {
    id: string;
    questionId: string;
    questionType: string;
    points: number;
    order: number;
    question: string;
    type: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
    title?: string;
    testCases?: any[];
    solution?: string;
  };
}

interface ExamSession {
  id: string;
  examId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  timeSpent: number;
  score: number;
  status: string;
  exam: {
    title: string;
    passingScore: number;
    totalQuestions: number;
  };
  examResults: ExamResult[];
}

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadExamResults();
    }
  }, [sessionId]);

  const loadExamResults = async () => {
    try {
      const response = await fetch(`/api/exams/sessions/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setSession(data.data);
      } else {
        setError(data.error || "Failed to load exam results");
      }
    } catch (error) {
      console.error("Error loading exam results:", error);
      setError("Failed to load exam results");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getScoreColor = (score: number, passingScore: number) => {
    const percentage = (score / passingScore) * 100;
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "mcq":
        return "Multiple Choice";
      case "coding":
        return "Coding Problem";
      case "text":
        return "Text Answer";
      default:
        return type;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-800";
      case "coding":
        return "bg-green-100 text-green-800";
      case "text":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Results..." />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <StudentHeader title="Exam Results" currentPage="exams" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Results Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The exam results you're looking for don't exist."}
            </p>
            <Button onClick={() => router.push("/student/exams")}>
              Back to Exams
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalScore = session.score;
  const maxScore = session.examResults.reduce(
    (sum, result) => sum + result.question.points,
    0
  );
  const correctAnswers = session.examResults.filter(
    (result) => result.isCorrect
  ).length;
  const passed = totalScore >= session.exam.passingScore;
  const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentHeader title="Exam Results" currentPage="exams" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/student/exams")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exams
          </Button>

          <div className="flex items-center space-x-4 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {session.exam.title}
              </h1>
              <p className="text-gray-600">Exam Results</p>
            </div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Score</h3>
            <p
              className={`text-3xl font-bold ${getScoreColor(
                totalScore,
                session.exam.passingScore
              )}`}
            >
              {totalScore}/{maxScore}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {scorePercentage.toFixed(1)}%
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Correct
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {correctAnswers}/{session.exam.totalQuestions}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {((correctAnswers / session.exam.totalQuestions) * 100).toFixed(
                1
              )}
              %
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time</h3>
            <p className="text-3xl font-bold text-purple-600">
              {formatTime(session.timeSpent)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Time Spent</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
            <div className="flex items-center justify-center">
              {passed ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-xl font-bold">Passed</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="w-6 h-6 mr-2" />
                  <span className="text-xl font-bold">Failed</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Passing: {session.exam.passingScore}
            </p>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Performance Overview
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                passed ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(scorePercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </Card>

        {/* Question Results */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Question Results
          </h3>
          <div className="space-y-4">
            {session.examResults.map((result, index) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${
                  result.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(
                        result.question.type
                      )}`}
                    >
                      {getQuestionTypeLabel(result.question.type)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {result.points}/{result.question.points} points
                    </span>
                  </div>
                  <div className="flex items-center">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-900 font-medium">
                    {result.question.question}
                  </p>
                </div>

                {result.question.type === "mcq" && (
                  <div className="text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Your Answer:</span>{" "}
                      {result.userAnswer !== null
                        ? result.userAnswer
                        : "Not answered"}
                    </p>
                  </div>
                )}

                {(result.question.type === "text" ||
                  result.question.type === "coding") && (
                  <div className="text-sm">
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Your Answer:</span>
                    </p>
                    <div className="bg-white p-3 rounded border text-sm font-mono">
                      {result.userAnswer || "No answer provided"}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => router.push("/student/exams")}
            variant="outline"
          >
            Back to Exams
          </Button>
          <Button onClick={() => router.push("/student/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
