"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { MCQQuestion } from "@/shared/components/MCQQuestion";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ApiErrorBoundary } from "@/shared/components/ApiErrorBoundary";
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
      console.log("Loading exam with ID:", examId);
      const response = await fetch(`/api/exams/${examId}`);
      console.log("Exam API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Exam API response data:", data);

      if (data.success) {
        setExam(data.data);
        await createExamSession(data.data);
      } else {
        console.error("Failed to load exam:", data.error);
        setError(`Failed to load exam: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error loading exam:", error);
      setError(
        `Error loading exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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

  return (
    <ErrorBoundary componentName="TakeExamPage">
      <ApiErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmExit(true)}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Exit</span>
                  </Button>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h1 className="text-lg font-semibold text-gray-900">
                      {exam?.title || "Loading Exam..."}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Overall Timer */}
                  {exam?.enableOverallTimer && (
                    <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                      <Timer className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-700">
                        {Math.floor(overallTimeRemaining / 60)}:
                        {(overallTimeRemaining % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Question Timer */}
                  {exam?.enableTimedQuestions && timeRemaining > 0 && (
                    <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">
                        {Math.floor(timeRemaining / 60)}:
                        {(timeRemaining % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {currentQuestionIndex + 1} / {exam?.totalQuestions || 0}
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
                  <p className="mt-4 text-gray-600">Loading exam...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error Loading Exam
                  </h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : success ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Success!
                  </h3>
                  <p className="text-gray-600 mb-4">{success}</p>
                  <Button onClick={() => router.push("/student/exams")}>
                    Go to Exams
                  </Button>
                </div>
              </div>
            ) : exam ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Question Navigation */}
                <div className="lg:col-span-1">
                  <Card className="p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {exam.examQuestions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            index === currentQuestionIndex
                              ? "bg-blue-600 text-white"
                              : answers[question.id]
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Question Content */}
                <div className="lg:col-span-3">
                  <Card className="p-8">
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Question {currentQuestionIndex + 1}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {exam.examQuestions[currentQuestionIndex]?.points}{" "}
                            points
                          </span>
                          {exam.examQuestions[currentQuestionIndex]
                            ?.timeLimit && (
                            <span className="text-sm text-gray-600">
                              •{" "}
                              {
                                exam.examQuestions[currentQuestionIndex]
                                  ?.timeLimit
                              }
                              s
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {exam.examQuestions[currentQuestionIndex]?.question}
                        </p>
                      </div>
                    </div>

                    {/* Question Type Specific Content */}
                    {exam.examQuestions[currentQuestionIndex]?.type ===
                      "mcq" && (
                      <MCQQuestion
                        question={exam.examQuestions[currentQuestionIndex]}
                        selectedAnswer={
                          answers[exam.examQuestions[currentQuestionIndex]?.id]
                        }
                        onSubmit={(answer: number) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [exam.examQuestions[currentQuestionIndex]?.id]:
                              answer,
                          }))
                        }
                      />
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="outline"
                        className="flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>

                      {currentQuestionIndex ===
                      exam.examQuestions.length - 1 ? (
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
                  </Card>
                </div>
              </div>
            ) : null}
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
                  Are you sure you want to exit? Your progress will be saved,
                  but you'll need to resume later.
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
                  Are you sure you want to submit your exam? You won't be able
                  to make changes after submission.
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
      </ApiErrorBoundary>
    </ErrorBoundary>
  );
}
