"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { StudentHeader } from "@/shared/components/StudentHeader";
import { ApiDebugPanel } from "@/shared/components/ApiDebugPanel";
import {
  FileText,
  Clock,
  Target,
  Users,
  Star,
  Calendar,
  Play,
  Search,
  Filter,
  Award,
  TrendingUp,
  BookOpen,
  Zap,
} from "lucide-react";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    examQuestions: number;
    examResults: number;
  };
}

export default function ExamsPage() {
  const { user, loading, isAdmin, isSuperAdmin } = useAuthContext();

  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiRequest, setApiRequest] = useState<any>(null);

  // Fetch available exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        setApiError(null);

        const requestData = {
          endpoint: "/api/exams",
          method: "GET",
        };
        setApiRequest(requestData);

        console.log("🔍 Fetching exams from API...");
        const response = await fetch("/api/exams");
        console.log("📥 API Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📋 Full API Response:", data);
          setApiResponse(data);
          setApiError(null);

          if (data.success) {
            console.log("✅ Setting exams:", data.data.length, "exams");
            setExams(data.data);
          } else {
            console.error("❌ API returned error:", data.error);
            setApiError(data.error);
          }
        } else {
          console.error(
            "❌ API request failed:",
            response.status,
            response.statusText
          );
          setApiError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("❌ Error fetching exams:", error);
      } finally {
        setLoadingExams(false);
      }
    };

    if (user && !isSuperAdmin) {
      fetchExams();
    } else if (isSuperAdmin) {
      console.log("Exams: SuperAdmin, skipping fetch");
      setApiRequest({
        endpoint: "/api/exams",
        method: "GET",
        note: "Skipped - SuperAdmin user",
      });
      setLoadingExams(false);
    } else {
      console.log("Exams: No user, setting loading to false");
      setApiRequest({
        endpoint: "/api/exams",
        method: "GET",
        note: "Skipped - No authenticated user",
      });
      setLoadingExams(false);
    }
  }, [user, isSuperAdmin]);

  // Handle redirects
  useEffect(() => {
    if (!loading) {
      if (!user && !isSuperAdmin) {
        console.log("Exams: User not authenticated, redirecting to homepage");
        window.location.href = "/";
      } else if ((isAdmin || isSuperAdmin) && user) {
        console.log("Exams: Admin/SuperAdmin detected, redirecting to admin");
        window.location.href = "/admin";
      }
    }
  }, [user, loading, isAdmin, isSuperAdmin]);

  // Filter exams
  useEffect(() => {
    filterExams();
  }, [exams, searchTerm, selectedDifficulty, selectedCategory]);

  const filterExams = () => {
    let filtered = exams.filter((exam) => exam.isActive);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (exam) => exam.difficulty === selectedDifficulty
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((exam) => exam.category === selectedCategory);
    }

    setFilteredExams(filtered);
  };

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show loading while fetching exams data
  if (loadingExams) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading Exams..." />
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
      case "database":
        return "🗄️";
      case "algorithms":
        return "🧮";
      case "system design":
        return "🏗️";
      case "aptitude":
        return "🧠";
      case "communication":
        return "💬";
      default:
        return "📚";
    }
  };

  const startExam = (examId: string) => {
    window.location.href = `/exams/take/${examId}`;
  };

  console.log("Exams: Rendering main exams content");

  if (!user) {
    return null;
  }

  const difficulties = [...new Set(exams.map((exam) => exam.difficulty))];
  const categories = [...new Set(exams.map((exam) => exam.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentHeader title="MyMentor Exams" currentPage="exams" />

      {/* API Debug Panel */}
      <div className="m-4">
        <ApiDebugPanel
          title="Student Exams API Debug"
          endpoint="/api/exams"
          method="GET"
          requestData={apiRequest}
          responseData={apiResponse}
          loading={loadingExams}
          error={apiError}
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Practice Exams for Success 🎯
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Test your knowledge with comprehensive exams designed for fresh
                graduates. Practice with real interview questions and improve
                your skills.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{exams.length}</div>
                  <div className="text-blue-100 text-sm">Available Exams</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {exams.reduce((sum, exam) => sum + exam.totalQuestions, 0)}
                  </div>
                  <div className="text-blue-100 text-sm">Total Questions</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {exams.reduce((sum, exam) => sum + exam.duration, 0)} min
                  </div>
                  <div className="text-blue-100 text-sm">Total Duration</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Exams Available
            </h3>
            <p className="text-gray-600 mb-6">
              {exams.length === 0
                ? "No exams have been created yet. Please check back later."
                : "No exams match your current filters. Try adjusting your search criteria."}
            </p>
            {exams.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Exams need to be created by an
                  administrator. Please contact your administrator to create
                  exams.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Card
                key={exam.id}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">
                          {getCategoryIcon(exam.category)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            exam.difficulty
                          )}`}
                        >
                          {exam.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {exam.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {exam.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {exam.duration} min
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {exam.totalQuestions} questions
                      </span>
                    </div>
                  </div>

                  {/* Timer Information */}
                  {(exam.enableOverallTimer || exam.enableTimedQuestions) && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-800 font-medium mb-1">
                        Timer Settings:
                      </div>
                      <div className="space-y-1">
                        {exam.enableOverallTimer && (
                          <div className="text-xs text-blue-700">
                            ⏱️ Overall: {exam.duration} minutes
                          </div>
                        )}
                        {exam.enableTimedQuestions && (
                          <div className="text-xs text-blue-700">
                            ⏰ Per Question: {exam.defaultQuestionTime} seconds
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {exam.category}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => startExam(exam.id)}
                    className="w-full group-hover:bg-blue-600 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Exam
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
