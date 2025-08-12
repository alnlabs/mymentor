"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Target,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  MessageSquare,
  Clock,
  Users,
  Search,
  Filter,
  CheckCircle,
  Code,
  Brain,
  FileText,
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  templateId: string;
  questionType: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  timeLimit?: number;
  order: number;
  isActive: boolean;
}

interface InterviewTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  companies: string[];
  isActive: boolean;
  questions: InterviewQuestion[];
  _count?: {
    mockInterviews: number;
  };
}

export default function InterviewTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const [template, setTemplate] = useState<InterviewTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionTypeFilter, setQuestionTypeFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Partial<InterviewTemplate>>({});

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interviews/templates/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setTemplate(result.data);
        setEditData(result.data);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/interviews/templates/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      if (result.success) {
        setTemplate(result.data);
        setShowEditModal(false);
        alert("Template updated successfully!");
      } else {
        alert(result.error || "Failed to update template");
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert("Failed to update template");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/interviews/templates/${params.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        alert("Template deleted successfully!");
        window.location.href = "/admin/interviews";
      } else {
        alert(result.error || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  const filteredQuestions = template?.questions.filter((question) => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !questionTypeFilter || question.questionType === questionTypeFilter;
    return matchesSearch && matchesType;
  }) || [];

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-800";
      case "coding":
        return "bg-green-100 text-green-800";
      case "behavioral":
        return "bg-purple-100 text-purple-800";
      case "system_design":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "mcq":
        return "Multiple Choice";
      case "coding":
        return "Coding Problem";
      case "behavioral":
        return "Behavioral";
      case "system_design":
        return "System Design";
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading size="lg" text="Loading template..." />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Template not found
        </h3>
        <p className="text-gray-600 mb-6">
          The interview template you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => (window.location.href = "/admin/interviews")}
          className="flex items-center mx-auto"
        >
          ← Back to Interviews
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <Target className="w-8 h-8 mr-3" />
                Interview Template
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/interviews")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Interviews
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
              <p className="text-purple-100">{template.description}</p>
              <div className="flex items-center mt-4 space-x-4 text-sm">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-300" />
                  <span>{template.duration} min</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-300" />
                  <span>{template.questions.length} questions</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-300" />
                  <span>{template._count?.mockInterviews || 0} interviews taken</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Template Details
            </h2>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDeleteTemplate}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category
              </label>
              <p className="text-lg font-medium text-gray-900 capitalize">
                {template.category.replace("-", " ")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Difficulty
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                  template.difficulty
                )}`}
              >
                {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  template.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {template.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Total Score
              </label>
              <p className="text-lg font-medium text-gray-900">
                {template.questions.reduce((sum, q) => sum + q.points, 0)} points
              </p>
            </div>
          </div>

          {template.companies.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Target Companies
              </label>
              <div className="flex flex-wrap gap-2">
                {template.companies.map((company) => (
                  <span
                    key={company}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Questions */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Questions ({template.questions.length})
            </h2>
            <Button
              onClick={() => (window.location.href = `/admin/interviews/${params.id}/questions`)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manage Questions
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
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
                onClick={() => setQuestionTypeFilter("mcq")}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                MCQ Only
              </Button>
              <Button
                onClick={() => setQuestionTypeFilter("coding")}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                Coding Only
              </Button>
              <Button
                onClick={() => setQuestionTypeFilter("behavioral")}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                Behavioral Only
              </Button>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || questionTypeFilter
                  ? "Try adjusting your search or filters."
                  : "This template doesn't have any questions yet."}
              </p>
              <Button
                onClick={() => (window.location.href = `/admin/interviews/${params.id}/questions`)}
                className="flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Questions
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          #{question.order + 1}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuestionTypeColor(
                            question.questionType
                          )}`}
                        >
                          {getQuestionTypeLabel(question.questionType)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {question.points} pts
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">
                        {question.question}
                      </h4>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {question.timeLimit && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(question.timeLimit)}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          question.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {question.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editData.description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editData.duration || 0}
                    onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
                    min="15"
                    max="180"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editData.isActive ? "true" : "false"}
                    onChange={(e) => setEditData({ ...editData, isActive: e.target.value === "true" })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTemplate}
                disabled={saving}
              >
                {saving ? (
                  <Loading size="sm" text="Saving..." />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
