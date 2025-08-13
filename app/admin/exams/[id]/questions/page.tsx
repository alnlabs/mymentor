"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Clock,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Timer,
  Target,
  CheckSquare,
  Square,
  Settings,
  RefreshCw,
} from "lucide-react";

interface ExamQuestion {
  id: string;
  examId: string;
  questionId: string;
  questionType: string;
  order: number;
  points: number;
  timeLimit?: number;
  isActive: boolean;
  questionData?: any;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  totalQuestions: number;
  defaultQuestionTime?: number;
}

export default function ExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [examId, setExamId] = useState<string>("");
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<"selected" | "all" | null>(null);

  // Handle params as Promise
  useEffect(() => {
    const getExamId = async () => {
      const resolvedParams = await params;
      setExamId(resolvedParams.id);
    };
    getExamId();
  }, [params]);

  useEffect(() => {
    if (examId) {
      fetchExam();
      fetchExamQuestions();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/exams/${examId}`);
      const result = await response.json();
      if (result.success) {
        setExam(result.data);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    }
  };

  const fetchExamQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/exams/${examId}/questions`);
      const result = await response.json();
      if (result.success) {
        setExamQuestions(result.data);
      }
    } catch (error) {
      console.error("Error fetching exam questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = async (
    questionId: string,
    questionType: string
  ) => {
    if (
      !confirm("Are you sure you want to remove this question from the exam?")
    )
      return;

    try {
      const response = await fetch(
        `/api/exams/${examId}/questions?questionId=${questionId}&questionType=${questionType}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.success) {
        fetchExamQuestions();
        // Remove from selected if it was selected
        setSelectedQuestions(prev => prev.filter(id => id !== questionId));
      }
    } catch (error) {
      console.error("Error removing question:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select questions to delete");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/exams/${examId}/questions/bulk-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: selectedQuestions }),
      });
      const result = await response.json();
      if (result.success) {
        setSelectedQuestions([]);
        setSelectAll(false);
        fetchExamQuestions();
        alert(`Successfully deleted ${result.deletedCount} questions`);
      }
    } catch (error) {
      console.error("Error bulk deleting questions:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/exams/${examId}/questions/delete-all`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setSelectedQuestions([]);
        setSelectAll(false);
        fetchExamQuestions();
        alert(`Successfully deleted all ${result.deletedCount} questions`);
      }
    } catch (error) {
      console.error("Error deleting all questions:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestionTimer = async (
    questionId: string,
    timeLimit: number
  ) => {
    try {
      setSaving(true);
      const response = await fetch(
        `/api/exams/${examId}/questions/${questionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeLimit }),
        }
      );
      const result = await response.json();
      if (result.success) {
        fetchExamQuestions();
      }
    } catch (error) {
      console.error("Error updating question timer:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestions = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select questions to add");
      return;
    }

    try {
      setSaving(true);
      const promises = selectedQuestions.map(async (questionId) => {
        const question = availableQuestions.find((q) => q.id === questionId);
        const response = await fetch(`/api/exams/${examId}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId,
            questionType: question.type,
            points: 10,
            timeLimit: exam?.defaultQuestionTime || 120,
          }),
        });
        return response.json();
      });

      await Promise.all(promises);
      setShowAddQuestion(false);
      setSelectedQuestions([]);
      fetchExamQuestions();
    } catch (error) {
      console.error("Error adding questions:", error);
    } finally {
      setSaving(false);
    }
  };

  const fetchAvailableQuestions = async (type: string) => {
    try {
      const response = await fetch(
        `/api/${type === "MCQ" ? "mcq" : "problems"}`
      );
      const result = await response.json();
      if (result.success) {
        setAvailableQuestions(result.data.map((q: any) => ({ ...q, type })));
      }
    } catch (error) {
      console.error("Error fetching available questions:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuestions([]);
      setSelectAll(false);
    } else {
      const allIds = filteredQuestions.map(q => q.id);
      setSelectedQuestions(allIds);
      setSelectAll(true);
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const filteredQuestions = examQuestions.filter((question) => {
    const matchesSearch =
      question.questionData?.question
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      question.questionData?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType =
      !questionTypeFilter || question.questionType === questionTypeFilter;
    return matchesSearch && matchesType;
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "MCQ":
        return "bg-blue-100 text-blue-800";
      case "Problem":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <BookOpen className="w-8 h-8 mr-3" />
                Exam Questions Management
              </h1>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/exams/${examId}/edit`)}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to Exam
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/exams")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← All Exams
                </Button>
              </div>
            </div>
            {exam && (
              <div>
                <h2 className="text-xl font-semibold mb-2">{exam.title}</h2>
                <p className="text-blue-100">{exam.description}</p>
                <div className="flex items-center mt-4 space-x-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-300" />
                    <span>{exam.duration} min total</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-300" />
                    <span>{exam.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center">
                    <Timer className="w-4 h-4 mr-2 text-blue-300" />
                    <span>
                      {exam.defaultQuestionTime || 120}s default per question
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedQuestions.length > 0 && (
        <Card>
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedQuestions.length} question(s) selected
              </span>
              <Button
                onClick={() => setSelectedQuestions([])}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  setDeleteType("selected");
                  setShowDeleteConfirm(true);
                }}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => setShowAddQuestion(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Questions
            </Button>
            <Button
              onClick={() => {
                setDeleteType("all");
                setShowDeleteConfirm(true);
              }}
              variant="outline"
              className="flex items-center text-red-600 hover:text-red-700 border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
            <Button
              onClick={fetchExamQuestions}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setQuestionTypeFilter("")}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              All Types
            </Button>
            <Button
              onClick={() => setQuestionTypeFilter("MCQ")}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              MCQ Only
            </Button>
            <Button
              onClick={() => setQuestionTypeFilter("Problem")}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              Problems Only
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="lg" text="Loading questions..." />
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || questionTypeFilter
                ? "Try adjusting your search or filters."
                : "This exam doesn't have any questions yet."}
            </p>
            <Button
              onClick={() => setShowAddQuestion(true)}
              className="flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All Header */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {selectAll ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
                <span>{selectAll ? "Deselect All" : "Select All"}</span>
              </button>
              <span className="text-sm text-gray-500">
                ({filteredQuestions.length} questions)
              </span>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    selectedQuestions.includes(question.id)
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Selection Checkbox */}
                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={() => handleSelectQuestion(question.id)}
                          className="flex items-center space-x-2"
                        >
                          {selectedQuestions.includes(question.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <span className="text-sm font-medium text-gray-500">
                          #{question.order}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuestionTypeColor(
                            question.questionType
                          )}`}
                        >
                          {question.questionType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {question.points} pts
                        </span>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">
                        {question.questionData?.question ||
                          question.questionData?.title ||
                          "Question"}
                      </h4>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {question.questionId.substring(0, 8)}...</span>
                        {question.timeLimit && (
                          <span className="flex items-center">
                            <Timer className="w-4 h-4 mr-1" />
                            {formatTime(question.timeLimit)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* Timer Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="30"
                          max="600"
                          value={question.timeLimit || ""}
                          onChange={(e) => {
                            const newTimeLimit = parseInt(e.target.value) || null;
                            handleUpdateQuestionTimer(question.id, newTimeLimit);
                          }}
                          placeholder="Time (s)"
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500">sec</span>
                      </div>

                      <Button
                        onClick={() =>
                          handleRemoveQuestion(
                            question.questionId,
                            question.questionType
                          )
                        }
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Add Questions Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Questions to Exam</h3>
              <Button
                onClick={() => setShowAddQuestion(false)}
                variant="outline"
                size="sm"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => fetchAvailableQuestions("MCQ")}
                  variant="outline"
                  className="flex items-center justify-center p-4"
                >
                  <BookOpen className="w-6 h-6 mr-2" />
                  Browse MCQ Questions
                </Button>
                <Button
                  onClick={() => fetchAvailableQuestions("Problem")}
                  variant="outline"
                  className="flex items-center justify-center p-4"
                >
                  <Target className="w-6 h-6 mr-2" />
                  Browse Coding Problems
                </Button>
              </div>

              {availableQuestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Available Questions:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {availableQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedQuestions([
                                ...selectedQuestions,
                                question.id,
                              ]);
                            } else {
                              setSelectedQuestions(
                                selectedQuestions.filter(
                                  (id) => id !== question.id
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {question.question || question.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {question.category} • {question.difficulty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  onClick={() => setShowAddQuestion(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddQuestions}
                  disabled={saving || selectedQuestions.length === 0}
                >
                  {saving ? (
                    <Loading size="sm" text="Adding..." />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add {selectedQuestions.length} Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {deleteType === "all"
                ? "Are you sure you want to delete ALL questions from this exam? This action cannot be undone."
                : `Are you sure you want to delete ${selectedQuestions.length} selected question(s)? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (deleteType === "all") {
                    handleDeleteAll();
                  } else {
                    handleBulkDelete();
                  }
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-600 hover:bg-red-700"
                disabled={saving}
              >
                {saving ? (
                  <Loading size="sm" text="Deleting..." />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
