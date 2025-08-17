"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { MCQQuestion } from "@/shared/components/MCQQuestion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Save,
  Play,
  RotateCcw,
  AlertCircle,
  Target,
  Timer,
  BarChart3,
  BookOpen,
} from "lucide-react";

interface ExamQuestion {
  id: string;
  type: "mcq" | "coding" | "text";
  question: string;
  options?: string[];
  points: number;
  timeLimit?: number;
  order: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: string;
  category: string;
  totalQuestions: number;
  passingScore: number;
  enableTimedQuestions: boolean;
  enableOverallTimer: boolean;
  defaultQuestionTime: number;
  examQuestions: ExamQuestion[];
}

interface ExamSession {
  id: string;
  examId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  timeSpent: number;
  score?: number;
  status: "in-progress" | "completed" | "abandoned";
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [overallTimeRemaining, setOverallTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      loadExam();
    }
  }, [examId]);

  useEffect(() => {
    if (exam) {
      // Set overall timer if enabled
      if (exam.enableOverallTimer) {
        setOverallTimeRemaining(exam.duration * 60);
      }

      // Set question timer if enabled and question has time limit
      if (
        exam.enableTimedQuestions &&
        exam.examQuestions[currentQuestionIndex]
      ) {
        const question = exam.examQuestions[currentQuestionIndex];
        setTimeRemaining(question.timeLimit || exam.defaultQuestionTime);
      }
    }
  }, [exam, currentQuestionIndex]);

  useEffect(() => {
    if (overallTimeRemaining > 0) {
      const timer = setInterval(() => {
        setOverallTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [overallTimeRemaining]);

  useEffect(() => {
    if (timeRemaining > 0 && exam?.enableTimedQuestions) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleNextQuestion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const loadExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`);
      const data = await response.json();

      if (data.success) {
        setExam(data.data);
        await createExamSession(data.data);
      } else {
        console.error("Failed to load exam:", data.error);
      }
    } catch (error) {
      console.error("Error loading exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const createExamSession = async (examData: Exam) => {
    try {
      console.log("Creating exam session for exam ID:", examId);

      const response = await fetch("/api/exams/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: examId,
          startTime: new Date().toISOString(),
        }),
      });

      console.log("Session creation response status:", response.status);
      const data = await response.json();
      console.log("Session creation response data:", data);

      if (data.success) {
        setSession(data.data);
        console.log("Exam session created successfully:", data.data);
      } else {
        console.error("Failed to create exam session:", data.error);
        setError(
          `Failed to create exam session: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error creating exam session:", error);
      setError(
        "Failed to create exam session. Please refresh the page and try again."
      );
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (exam && currentQuestionIndex < exam.examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitExam = async () => {
    setShowConfirmSubmit(false);
    setSaving(true);

    if (!session?.id) {
      console.error("No exam session found");
      setError("No exam session found. Please refresh the page and try again.");
      setSaving(false);
      return;
    }

    try {
      console.log("Submitting exam with session ID:", session.id);
      console.log("Answers:", answers);

      const response = await fetch(
        `/api/exams/sessions/${session?.id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            endTime: new Date().toISOString(),
          }),
        }
      );

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("Exam submitted successfully, redirecting to results");
        setSuccess("Exam submitted successfully! Redirecting to results...");
        setTimeout(() => {
          router.push(`/student/exams/results/${session?.id}`);
        }, 1000);
      } else {
        console.error("API returned error:", data.error);
        setError(`Failed to submit exam: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      setError("Failed to submit exam. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        <Loading size="lg" text="Loading Exam..." />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Exam Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The exam you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/student/exams")}>
            Back to Exams
          </Button>
        </Card>
      </div>
    );
  }

  // Check if exam has questions
  if (!exam.examQuestions || exam.examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-4">
            This exam doesn't have any questions yet.
          </p>
          <Button onClick={() => router.push("/student/exams")}>
            Back to Exams
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.examQuestions[currentQuestionIndex];

  // Check if current question exists
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Question Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested question doesn't exist.
          </p>
          <Button onClick={() => router.push("/student/exams")}>
            Back to Exams
          </Button>
        </Card>
      </div>
    );
  }

  const progress =
    ((currentQuestionIndex + 1) / exam.examQuestions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {exam.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {exam.category} • {exam.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Overall Timer */}
              {exam.enableOverallTimer && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 rounded-xl border border-red-200">
                  <Timer className="w-5 h-5 text-red-600" />
                  <span className="font-mono text-red-700 font-bold text-lg">
                    {formatTime(overallTimeRemaining)}
                  </span>
                </div>
              )}

              {/* Question Timer */}
              {exam.enableTimedQuestions && currentQuestion.timeLimit && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 rounded-xl border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-mono text-orange-700 font-bold text-lg">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-3 rounded-xl border border-gray-200">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {currentQuestionIndex + 1} / {exam.examQuestions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-500 p-2 rounded-full mr-3">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-red-800 font-medium text-lg">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-500 p-2 rounded-full mr-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-green-800 font-medium text-lg">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-500 hover:text-green-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progress: {Math.round(progress)}%</span>
            <span>
              {answeredQuestions} of {exam.examQuestions.length} answered
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-6 text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Questions
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {exam.examQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 shadow-sm ${
                      index === currentQuestionIndex
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                        : answers[question.id]
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 hover:shadow-md"
                        : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200 hover:shadow-md"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Answered:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {answeredQuestions}/{exam.examQuestions.length}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (answeredQuestions / exam.examQuestions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card className="p-8 bg-gradient-to-br from-white to-blue-50 border border-gray-200 shadow-lg">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${getQuestionTypeColor(
                      currentQuestion.type
                    )}`}
                  >
                    {getQuestionTypeLabel(currentQuestion.type)}
                  </span>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-xl border border-yellow-200">
                    <Target className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">
                      {currentQuestion.points} points
                    </span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-lg mr-3 text-lg">
                      {currentQuestionIndex + 1}
                    </span>
                    Question
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-900 leading-relaxed text-lg font-medium">
                      {currentQuestion.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Section */}
              <div className="mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-lg mr-3">
                      Answer
                    </span>
                  </h3>

                  {currentQuestion.type === "mcq" &&
                    currentQuestion.options && (
                      <div className="space-y-4">
                        {(typeof currentQuestion.options === "string"
                          ? (() => {
                              try {
                                return JSON.parse(currentQuestion.options);
                              } catch (e) {
                                console.error("Error parsing options:", e);
                                return [];
                              }
                            })()
                          : currentQuestion.options
                        ).map((option: string, index: number) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleAnswerChange(currentQuestion.id, index)
                            }
                            className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ${
                              answers[currentQuestion.id] === index
                                ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-500 text-blue-900 shadow-md"
                                : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  answers[currentQuestion.id] === index
                                    ? "bg-blue-600 border-blue-600"
                                    : "border-gray-400"
                                }`}
                              >
                                {answers[currentQuestion.id] === index && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className="font-medium text-lg">
                                {option}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                  {currentQuestion.type === "text" && (
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Your Answer
                      </label>
                      <textarea
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Type your answer here..."
                      />
                    </div>
                  )}

                  {currentQuestion.type === "coding" && (
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-3">
                        Your Code
                      </label>
                      <textarea
                        value={answers[currentQuestion.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(currentQuestion.id, e.target.value)
                        }
                        className="w-full h-64 px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Write your code here..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 hover:from-gray-100 hover:to-slate-100 px-6 py-3"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmExit(true)}
                    className="bg-gradient-to-r from-red-50 to-pink-50 border-red-300 text-red-700 hover:from-red-100 hover:to-pink-100 px-6 py-3"
                  >
                    Exit Exam
                  </Button>

                  {currentQuestionIndex === exam.examQuestions.length - 1 ? (
                    <Button
                      onClick={() => setShowConfirmSubmit(true)}
                      disabled={saving}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 text-lg font-bold"
                    >
                      {saving ? "Submitting..." : "Submit Exam"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="p-8 max-w-md bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Exit Exam?
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Are you sure you want to exit? Your progress will be saved, but
                you'll need to resume later.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmExit(false)}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 hover:from-gray-100 hover:to-slate-100 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => router.push("/student/exams")}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-6 py-3"
                >
                  Exit Exam
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="p-8 max-w-md bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Submit Exam?
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Are you sure you want to submit your exam? You won't be able to
                make changes after submission.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300 hover:from-gray-100 hover:to-slate-100 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitExam}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3"
                >
                  {saving ? "Submitting..." : "Submit Exam"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
