"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { InterviewTemplate } from "@/shared/types/common";
import { Plus, Edit, Trash2, Eye, Users, Clock, Target } from "lucide-react";

export default function AdminInterviewsPage() {
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] =
    useState<InterviewTemplate | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/interviews/templates");
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this interview template? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/interviews/templates/${templateId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTemplates(templates.filter((t) => t.id !== templateId));
        alert("Template deleted successfully");
      } else {
        alert("Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return "🎨";
      case "backend":
        return "⚙️";
      case "fullstack":
        return "🔄";
      case "ml":
        return "🤖";
      case "mobile":
        return "📱";
      default:
        return "💻";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" text="Loading Interview Templates..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mock Interview Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage interview templates for users
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/admin/interviews/add")}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Templates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Templates
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.filter((t) => t.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(templates.map((t) => t.category)).size}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {templates.length > 0
                  ? Math.round(
                      templates.reduce((sum, t) => sum + t.duration, 0) /
                        templates.length
                    )
                  : 0}{" "}
                min
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getCategoryIcon(template.category)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600">{template.category}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  template.difficulty
                )}`}
              >
                {template.difficulty}
              </span>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">
              {template.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{template.duration} min</span>
                </div>
                {template.companies && template.companies.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{template.companies.length} companies</span>
                  </div>
                )}
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.isActive
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {template.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            {template.companies && template.companies.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Target Companies:</p>
                <div className="flex flex-wrap gap-1">
                  {template.companies.slice(0, 3).map((company, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {company}
                    </span>
                  ))}
                  {template.companies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                      +{template.companies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = `/admin/interviews/${template.id}`)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Manage
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/interviews?preview=${template.id}`, "_blank")
                }
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteTemplate(template.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>



      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Edit Interview Template
            </h3>
            <p className="text-gray-600 mb-4">
              Template editing feature is coming soon! You'll be able to modify
              questions, time limits, and other settings.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setEditingTemplate(null)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
