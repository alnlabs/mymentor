"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { useAuthContext } from "@/shared/components/AuthContext";
import { RouteGuard } from "@/shared/components/RouteGuard";
import { ArrowLeft, Save, Trash2, AlertCircle } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  targetRole: string | null;
  questionTypes: string;
  totalQuestions: number;
  passingScore: number;
  enableTimedQuestions: boolean;
  enableOverallTimer: boolean;
  defaultQuestionTime: number;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin, isSuperAdmin } = useAuthContext();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    difficulty: "Easy",
    category: "",
    targetRole: "",
    questionTypes: "Mixed",
    totalQuestions: 10,
    passingScore: 60,
    enableTimedQuestions: false,
    enableOverallTimer: true,
    defaultQuestionTime: 120,
    isActive: true,
    isPublic: true,
  });

  useEffect(() => {
    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/exams/${examId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exam");
      }
      const examData = await response.json();
      setExam(examData);
      setFormData({
        title: examData.title || "",
        description: examData.description || "",
        duration: examData.duration || 30,
        difficulty: examData.difficulty || "Easy",
        category: examData.category || "",
        targetRole: examData.targetRole || "",
        questionTypes: examData.questionTypes || "Mixed",
        totalQuestions: examData.totalQuestions || 10,
        passingScore: examData.passingScore || 60,
        enableTimedQuestions: examData.enableTimedQuestions || false,
        enableOverallTimer: examData.enableOverallTimer !== false,
        defaultQuestionTime: examData.defaultQuestionTime || 120,
        isActive: examData.isActive !== false,
        isPublic: examData.isPublic !== false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch exam");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/exams/${examId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update exam");
      }

      // Redirect back to exams list
      router.push("/admin/exams");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update exam");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone.")) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete exam");
      }

      router.push("/admin/exams");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete exam");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RouteGuard requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loading />
        </div>
      </RouteGuard>
    );
  }

  if (error && !exam) {
    return (
      <RouteGuard requiredRole="admin">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => router.push("/admin/exams")}>
                Back to Exams
              </Button>
            </div>
          </Card>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/exams")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Exams</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
                  <p className="text-gray-600">Update exam details and settings</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Structures">Data Structures</option>
                      <option value="Algorithms">Algorithms</option>
                      <option value="System Design">System Design</option>
                      <option value="Database">Database</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Exam Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Exam Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Questions
                    </label>
                    <input
                      type="number"
                      value={formData.totalQuestions}
                      onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Types
                  </label>
                  <select
                    value={formData.questionTypes}
                    onChange={(e) => setFormData({ ...formData, questionTypes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="MCQ">MCQ Only</option>
                    <option value="Coding">Coding Only</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>

              {/* Timer Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timer Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableOverallTimer"
                      checked={formData.enableOverallTimer}
                      onChange={(e) => setFormData({ ...formData, enableOverallTimer: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableOverallTimer" className="ml-2 block text-sm text-gray-900">
                      Enable overall exam timer
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableTimedQuestions"
                      checked={formData.enableTimedQuestions}
                      onChange={(e) => setFormData({ ...formData, enableTimedQuestions: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableTimedQuestions" className="ml-2 block text-sm text-gray-900">
                      Enable per-question timer
                    </label>
                  </div>
                  {formData.enableTimedQuestions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Question Time (seconds)
                      </label>
                      <input
                        type="number"
                        value={formData.defaultQuestionTime}
                        onChange={(e) => setFormData({ ...formData, defaultQuestionTime: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="30"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Visibility Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Visibility Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active (available for students)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                      Public (visible to all users)
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </RouteGuard>
  );
}
