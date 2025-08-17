"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { useAuthContext } from "@/shared/components/AuthContext";
import { StudentHeader } from "@/shared/components/StudentHeader";
import { InterviewCard } from "@/modules/interviews/components/InterviewCard";
import { InterviewTemplate } from "@/shared/types/common";
import { Filter, Search, Plus } from "lucide-react";

export default function InterviewsPage() {
  const {
    user,
    loading: authLoading,
    isAdmin,
    isSuperAdmin,
  } = useAuthContext();

  const [templates, setTemplates] = useState<InterviewTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<
    InterviewTemplate[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch interview templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/interviews/templates");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTemplates(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !isSuperAdmin) {
      fetchTemplates();
    } else if (isSuperAdmin) {
      console.log("Interviews: SuperAdmin, skipping fetch");
      setLoading(false);
    } else {
      console.log("Interviews: No user, setting loading to false");
      setLoading(false);
    }
  }, [user, isSuperAdmin]);

  // Handle redirects
  useEffect(() => {
    if (!authLoading) {
      if (!user && !isSuperAdmin) {
        console.log(
          "Interviews: User not authenticated, redirecting to homepage"
        );
        window.location.href = "/";
      } else if ((isAdmin || isSuperAdmin) && user) {
        console.log(
          "Interviews: Admin/SuperAdmin detected, redirecting to admin"
        );
        window.location.href = "/admin";
      }
    }
  }, [user, authLoading, isAdmin, isSuperAdmin]);

  // Filter templates
  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedDifficulty, selectedCategory]);

  const filterTemplates = () => {
    let filtered = templates.filter((template: any) => template.isActive);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (template: any) =>
          template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          template.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty && selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (template: any) => template.difficulty === selectedDifficulty
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (template: any) => template.category === selectedCategory
      );
    }

    setFilteredTemplates(filtered);
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
          userId: user?.uid || "superadmin-user",
          templateId: template.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the interview session
        window.location.href = `/student/interviews/take/${data.data.id}`;
      } else {
        alert("Failed to start interview: " + data.error);
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      alert("Failed to start interview");
    }
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show loading while fetching templates data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Interviews..." />
      </div>
    );
  }

  // Show loading while redirecting
  if (!user && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting to homepage..." />
      </div>
    );
  }

  // Show loading while redirecting admin
  if ((isAdmin || isSuperAdmin) && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Redirecting to admin..." />
      </div>
    );
  }

  console.log("Interviews: Rendering main interviews content");

  const difficulties = ["all", "easy", "medium", "hard"];
  const categories = [
    "all",
    "frontend",
    "backend",
    "fullstack",
    "ml",
    "mobile",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentHeader title="MyMentor Interviews" currentPage="interviews" />

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search interview templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all"
                      ? "All Difficulties"
                      : difficulty.charAt(0).toUpperCase() +
                        difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Interview Templates Available
            </h3>
            <p className="text-gray-600 mb-6">
              {templates.length === 0
                ? "No interview templates have been created yet. Please check back later."
                : "No templates match your current filters. Try adjusting your search criteria."}
            </p>
            {templates.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Interview templates need to be created
                  by an administrator. Please contact your administrator to
                  create interview templates.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <InterviewCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
