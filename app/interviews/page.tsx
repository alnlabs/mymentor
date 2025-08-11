"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { useAuthContext } from "@/shared/components/AuthContext";
import { InterviewCard } from "@/modules/interviews/components/InterviewCard";
import { InterviewTemplate } from "@/shared/types/common";
import { Filter, Search, Plus } from "lucide-react";

export default function InterviewsPage() {
  const { user, isAdmin, isSuperAdmin } = useAuthContext();
  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleTemplateSelect = async (template: InterviewTemplate) => {
    if (!user && !isSuperAdmin) {
      alert("Please sign in to start an interview");
      return;
    }

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || 'superadmin-user',
          templateId: template.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the interview session
        window.location.href = `/interviews/${data.data.id}`;
      } else {
        alert("Failed to start interview: " + data.error);
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview");
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      template.difficulty === selectedDifficulty;
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const difficulties = ["all", "easy", "medium", "hard"];
  const categories = [
    "all",
    "frontend",
    "backend",
    "fullstack",
    "ml",
    "mobile",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Interview Templates..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mock Interviews
              </h1>
              <p className="text-gray-600 mt-1">
                Practice with realistic interview scenarios
              </p>
            </div>
                          {(isAdmin || isSuperAdmin) && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Difficulty:
              </span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Interviews ({filteredTemplates.length})
            </h2>
            <div className="text-sm text-gray-600">
              {filteredTemplates.length} of {templates.length} templates
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No interviews found</h3>
              <p className="text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <InterviewCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Template Modal (for admins) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Create Interview Template
            </h3>
            <p className="text-gray-600 mb-4">
              This feature is coming soon! You'll be able to create custom
              interview templates.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowCreateModal(false)}
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
