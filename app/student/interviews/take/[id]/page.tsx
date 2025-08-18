"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
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
  Pause,
  RotateCcw,
  AlertCircle,
  Target,
  Timer,
  BarChart3,
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  type: "mcq" | "basic-coding" | "behavioral" | "scenario";
  question: string;
  options?: string[];
  points: number;
  timeLimit: number;
  order: number;
}

interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  companies: string[];
  questions: InterviewQuestion[];
}

interface InterviewSession {
  id: string;
  templateId: string;
  userId: string;
  status: "in-progress" | "completed" | "paused";
  currentQuestion: number;
  answers: Record<string, any>;
  startTime: Date;
  endTime?: Date;
  timeSpent: number;
}

export default function TakeInterviewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<InterviewTemplate | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  useEffect(() => {
    if (templateId) {
      loadInterviewTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    if (template && template.questions[currentQuestionIndex]) {
      const question = template.questions[currentQuestionIndex];
      setTimeRemaining(question.timeLimit);
    }
  }, [template, currentQuestionIndex]);

  useEffect(() => {
    if (timeRemaining > 0 && !isPaused) {
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

  const loadInterviewTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interviews/templates/${templateId}`);
      const result = await response.json();

      if (result.success) {
        setTemplate(result.data);
        // Create or resume session
        await createOrResumeSession(result.data);
      } else {
        alert("Failed to load interview template");
        router.push("/interviews");
      }
    } catch (error) {
      console.error("Error loading template:", error);
      alert("Failed to load interview template");
      router.push("/interviews");
    } finally {
      setLoading(false);
    }
  };

  const createOrResumeSession = async (templateData: InterviewTemplate) => {
    try {
      const response = await fetch("/api/interviews/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: templateId,
          action: "create-or-resume",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSession(result.data.session);
        setCurrentQuestionIndex(result.data.currentQuestion || 0);
        setAnswers(result.data.answers || {});
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  const handleNextQuestion = () => {
    if (template && currentQuestionIndex < template.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      saveProgress();
    } else {
      handleCompleteInterview();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      // Pause session
      updateSessionStatus("paused");
    } else {
      // Resume session
      updateSessionStatus("in-progress");
    }
  };

  const updateSessionStatus = async (status: string) => {
    if (!session) return;

    try {
      await fetch(`/api/interviews/sessions/${session.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error("Error updating session status:", error);
    }
  };

  const saveProgress = async () => {
    if (!session) return;

    try {
      setSaving(true);
      await fetch(`/api/interviews/sessions/${session.id}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentQuestion: currentQuestionIndex,
          answers,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!session) return;

    try {
      setSaving(true);
      const response = await fetch(
        `/api/interviews/sessions/${session.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push(`/interviews/results/${result.data.resultId}`);
      }
    } catch (error) {
      console.error("Error completing interview:", error);
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
      case "basic-coding":
        return "Simple Code";
      case "behavioral":
        return "Behavioral";
      case "scenario":
        return "Real Scenario";
      default:
        return type;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Interview..." />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The interview template you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/interviews")}>
            Back to Interviews
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = template.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / template.questions.length) * 100;

  return (
    <ErrorBoundary componentName="TakeInterviewPage">
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
                    <Target className="w-5 h-5 text-blue-600" />
                    <h1 className="text-lg font-semibold text-gray-900">
                      {template?.name || "Loading Interview..."}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Timer */}
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <Timer className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      {Math.floor(timeRemaining / 60)}:
                      {(timeRemaining % 60).toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Pause/Resume Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center space-x-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    )}
                  </Button>

                  {/* Progress */}
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {currentQuestionIndex + 1} /{" "}
                      {template?.questions.length || 0}
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
                  <p className="mt-4 text-gray-600">Loading interview...</p>
                </div>
              </div>
            ) : !template ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interview Not Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The interview template you're looking for doesn't exist.
                  </p>
                  <Button onClick={() => router.push("/student/interviews")}>
                    Back to Interviews
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                            {template.questions[currentQuestionIndex]?.points}{" "}
                            points
                          </span>
                          <span className="text-sm text-gray-600">
                            •{" "}
                            {
                              template.questions[currentQuestionIndex]
                                ?.timeLimit
                            }
                            s
                          </span>
                        </div>
                      </div>

                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {template.questions[currentQuestionIndex]?.question}
                        </p>
                      </div>
                    </div>

                    {/* Answer Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Answer
                      </h3>

                      {template.questions[currentQuestionIndex]?.type ===
                        "mcq" && (
                        <div className="space-y-3">
                          {template.questions[
                            currentQuestionIndex
                          ]?.options?.map((option: string, index: number) => (
                            <label
                              key={index}
                              className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                            >
                              <input
                                type="radio"
                                name="answer"
                                value={index}
                                checked={
                                  answers[
                                    template.questions[currentQuestionIndex]?.id
                                  ]?.answer === index
                                }
                                onChange={(e) =>
                                  handleAnswerChange(
                                    template.questions[currentQuestionIndex]
                                      ?.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="mr-3"
                              />
                              <span className="text-gray-900">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {template.questions[currentQuestionIndex]?.type ===
                        "behavioral" && (
                        <textarea
                          value={
                            answers[
                              template.questions[currentQuestionIndex]?.id
                            ]?.answer || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              template.questions[currentQuestionIndex]?.id,
                              e.target.value
                            )
                          }
                          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Type your answer here..."
                        />
                      )}

                      {template.questions[currentQuestionIndex]?.type ===
                        "basic-coding" && (
                        <textarea
                          value={
                            answers[
                              template.questions[currentQuestionIndex]?.id
                            ]?.answer || ""
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              template.questions[currentQuestionIndex]?.id,
                              e.target.value
                            )
                          }
                          className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Write your code here..."
                        />
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
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
                      template.questions.length - 1 ? (
                        <Button
                          onClick={handleCompleteInterview}
                          disabled={saving}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 text-lg font-bold"
                        >
                          {saving ? "Submitting..." : "Submit Interview"}
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

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Progress */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Progress
                    </h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {currentQuestionIndex + 1}
                      </div>
                      <div className="text-sm text-gray-600">
                        of {template.questions.length} questions
                      </div>
                    </div>
                  </Card>

                  {/* Question Navigator */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {template.questions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            index === currentQuestionIndex
                              ? "bg-blue-600 text-white"
                              : answers[question.id]?.answer
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Interview Info */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Interview Info
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <div className="font-medium">{template.category}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Difficulty:</span>
                        <div className="font-medium capitalize">
                          {template.difficulty}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-medium">
                          {template.duration} minutes
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Points:</span>
                        <div className="font-medium">
                          {template.questions.reduce(
                            (sum, q) => sum + q.points,
                            0
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Exit Modal */}
        {showConfirmExit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Exit Interview?
              </h3>
              <p className="text-gray-600 mb-6">
                Your progress will be saved automatically. You can resume this
                interview later.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmExit(false)}
                  className="flex-1"
                >
                  Continue Interview
                </Button>
                <Button
                  onClick={() => router.push("/student/interviews")}
                  className="flex-1"
                >
                  Exit Interview
                </Button>
              </div>
            </Card>
          </div>
        )}
      </ApiErrorBoundary>
    </ErrorBoundary>
  );
}
