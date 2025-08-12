"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Trophy,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Star,
  Award,
  Lightbulb,
  ArrowRight,
  Download,
  Share2,
  RotateCcw,
} from "lucide-react";

interface InterviewResult {
  id: string;
  templateId: string;
  userId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  startTime: Date;
  completedAt: Date;
  answers: Record<string, any>;
  feedback: string;
  categoryScores: Record<string, number>;
  questionAnalysis: Array<{
    questionId: string;
    type: string;
    points: number;
    earnedPoints: number;
    timeSpent: number;
    correct: boolean;
    feedback: string;
  }>;
}

interface InterviewTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  questions: Array<{
    id: string;
    type: string;
    question: string;
    points: number;
    timeLimit: number;
  }>;
}

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<InterviewResult | null>(null);
  const [template, setTemplate] = useState<InterviewTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (resultId) {
      loadInterviewResult();
    }
  }, [resultId]);

  const loadInterviewResult = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interviews/results/${resultId}`);
      const result = await response.json();

      if (result.success) {
        setResult(result.data.result);
        setTemplate(result.data.template);
      } else {
        alert("Failed to load interview result");
        router.push("/interviews");
      }
    } catch (error) {
      console.error("Error loading result:", error);
      alert("Failed to load interview result");
      router.push("/interviews");
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90)
      return {
        level: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
        icon: "🏆",
      };
    if (percentage >= 80)
      return {
        level: "Very Good",
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: "🥇",
      };
    if (percentage >= 70)
      return {
        level: "Good",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: "🥈",
      };
    if (percentage >= 60)
      return {
        level: "Satisfactory",
        color: "text-orange-600",
        bg: "bg-orange-100",
        icon: "🥉",
      };
    return {
      level: "Needs Improvement",
      color: "text-red-600",
      bg: "bg-red-100",
      icon: "📈",
    };
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return "❓";
      case "basic-coding":
        return "💻";
      case "behavioral":
        return "💬";
      case "scenario":
        return "🎯";
      default:
        return "📝";
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-800";
      case "basic-coding":
        return "bg-green-100 text-green-800";
      case "behavioral":
        return "bg-purple-100 text-purple-800";
      case "scenario":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Results..." />
      </div>
    );
  }

  if (!result || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Results Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The interview results you're looking for don't exist.
          </p>
          <Button onClick={() => router.push("/interviews")}>
            Back to Interviews
          </Button>
        </Card>
      </div>
    );
  }

  const performance = getPerformanceLevel(result.percentage);
  const totalQuestions = template.questions.length;
  const correctAnswers = result.questionAnalysis.filter(
    (q) => q.correct
  ).length;
  const averageTimePerQuestion = result.timeSpent / totalQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/interviews")}
                className="flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Interviews
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Interview Results
                </h1>
                <p className="text-sm text-gray-600">{template.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className="mb-8">
          <Card className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4">{performance.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {result.score} / {result.maxScore}
                </h2>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${performance.bg} ${performance.color}`}
                >
                  {result.percentage}% - {performance.level}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {result.percentage}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(result.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(averageTimePerQuestion)}m
                </div>
                <div className="text-sm text-gray-600">Avg per Question</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg mb-8 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "analysis"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            🔍 Question Analysis
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === "recommendations"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            💡 Recommendations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Summary */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Performance Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Overall Score</span>
                  <span className="font-semibold">{result.percentage}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Status</span>
                  <span
                    className={`font-semibold ${
                      result.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Time Efficiency</span>
                  <span className="font-semibold">
                    {result.timeSpent <= template.duration * 60
                      ? "Good"
                      : "Slow"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Completion Date</span>
                  <span className="font-semibold">
                    {formatDateTime(result.completedAt)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Category Performance */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Category Performance
              </h3>
              <div className="space-y-4">
                {Object.entries(result.categoryScores).map(
                  ([category, score]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 capitalize">
                          {category.replace("-", " ")}
                        </span>
                        <span className="font-semibold">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            score >= 80
                              ? "bg-green-500"
                              : score >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "analysis" && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Question-by-Question Analysis
            </h3>
            <div className="space-y-4">
              {result.questionAnalysis.map((question, index) => {
                const templateQuestion = template.questions.find(
                  (q) => q.id === question.questionId
                );
                return (
                  <div
                    key={question.questionId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">
                          {getQuestionTypeIcon(question.type)}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Question {index + 1}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(
                              question.type
                            )}`}
                          >
                            {question.type.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Points</div>
                        <div className="font-semibold">
                          {question.earnedPoints}/{question.points}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">
                      {templateQuestion?.question}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`flex items-center ${
                            question.correct ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {question.correct ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          {question.correct ? "Correct" : "Incorrect"}
                        </span>
                        <span className="text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {Math.round(question.timeSpent / 60)}m
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {Math.round(
                          (question.earnedPoints / question.points) * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {activeTab === "recommendations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Improvement Areas */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Areas for Improvement
              </h3>
              <div className="space-y-4">
                {result.percentage < 80 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      📈 Overall Performance
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      Your overall score of {result.percentage}% indicates room
                      for improvement. Focus on understanding the core concepts
                      better.
                    </p>
                  </div>
                )}

                {Object.entries(result.categoryScores).map(
                  ([category, score]) => {
                    if (score < 70) {
                      return (
                        <div
                          key={category}
                          className="p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <h4 className="font-semibold text-red-800 mb-2">
                            🎯 {category.replace("-", " ").toUpperCase()}
                          </h4>
                          <p className="text-red-700 text-sm">
                            Your score of {score}% in this area needs attention.
                            Practice more questions in this category.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }
                )}
              </div>
            </Card>

            {/* Strengths */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                Your Strengths
              </h3>
              <div className="space-y-4">
                {Object.entries(result.categoryScores).map(
                  ([category, score]) => {
                    if (score >= 80) {
                      return (
                        <div
                          key={category}
                          className="p-4 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <h4 className="font-semibold text-green-800 mb-2">
                            ⭐ {category.replace("-", " ").toUpperCase()}
                          </h4>
                          <p className="text-green-700 text-sm">
                            Excellent performance with {score}%! You have strong
                            skills in this area.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }
                )}

                {result.timeSpent <= template.duration * 60 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      ⏱️ Time Management
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Great job managing your time efficiently! You completed
                      the interview within the allocated time.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
                Recommended Next Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    📚 Study Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Review questions you answered incorrectly</li>
                    <li>• Practice more questions in weak areas</li>
                    <li>• Focus on time management techniques</li>
                    <li>• Take similar interviews to build confidence</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    🎯 Action Items
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Schedule another practice interview</li>
                    <li>• Review position-specific requirements</li>
                    <li>• Build a study schedule</li>
                    <li>• Track your progress over time</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => router.push("/interviews")}
            variant="outline"
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Interview
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="flex items-center"
          >
            <Target className="w-4 h-4 mr-2" />
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
