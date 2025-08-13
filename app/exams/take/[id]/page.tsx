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
  Pause,
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
  const [isPaused, setIsPaused] = useState(false);
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
    if (overallTimeRemaining > 0 && !isPaused) {
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
  }, [overallTimeRemaining, isPaused]);

  useEffect(() => {
    if (timeRemaining > 0 && !isPaused && exam?.enableTimedQuestions) {
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
  }, [timeRemaining, isPaused]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {exam.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {exam.category} • {exam.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Overall Timer */}
              {exam.enableOverallTimer && (
                <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                  <Timer className="w-5 h-5 text-red-600" />
                  <span className="font-mono text-red-600 font-bold">
                    {formatTime(overallTimeRemaining)}
                  </span>
                </div>
              )}

              {/* Question Timer */}
              {exam.enableTimedQuestions && currentQuestion.timeLimit && (
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-mono text-orange-600 font-bold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} / {exam.examQuestions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <p className="text-green-700 font-medium">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {exam.examQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white"
                        : answers[question.id]
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium">
                    {answeredQuestions}/{exam.examQuestions.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(
                      currentQuestion.type
                    )}`}
                  >
                    {getQuestionTypeLabel(currentQuestion.type)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {currentQuestion.points} points
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaused(!isPaused)}
                    disabled={
                      !exam.enableOverallTimer && !exam.enableTimedQuestions
                    }
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
              </div>

              {/* Answer Section */}
              <div className="mb-8">
                {currentQuestion.type === "mcq" && currentQuestion.options && (
                  <MCQQuestion
                    question={{
                      id: currentQuestion.id,
                      question: currentQuestion.question,
                      options: JSON.stringify(currentQuestion.options),
                      correctAnswer: currentQuestion.correctAnswer || 0,
                      explanation: currentQuestion.explanation || "",
                      category: currentQuestion.category || "",
                      difficulty: currentQuestion.difficulty || "Medium",
                      subject: currentQuestion.subject || "",
                    }}
                    selectedAnswer={answers[currentQuestion.id]}
                    onAnswerSelect={(answer) =>
                      handleAnswerChange(currentQuestion.id, answer)
                    }
                  />
                )}

                {currentQuestion.type === "text" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}

                {currentQuestion.type === "coding" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Code
                    </label>
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write your code here..."
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmExit(true)}
                  >
                    Exit Exam
                  </Button>

                  {currentQuestionIndex === exam.examQuestions.length - 1 ? (
                    <Button
                      onClick={() => setShowConfirmSubmit(true)}
                      disabled={saving}
                    >
                      {saving ? "Submitting..." : "Submit Exam"}
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exit Exam?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit? Your progress will be saved, but
              you'll need to resume later.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmExit(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => router.push("/student/exams")}
              >
                Exit Exam
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Exam?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You won't be able to
              make changes after submission.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmitExam} disabled={saving}>
                {saving ? "Submitting..." : "Submit Exam"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
