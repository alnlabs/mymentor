"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { ApiDebugPanel } from "@/shared/components/ApiDebugPanel";
import {
  createActionColumn,
  createCheckboxColumn,
} from "@/shared/components/AdvancedTable";
import { AdvancedListView } from "@/shared/components/AdvancedListView";
import { ColumnDef } from "@tanstack/react-table";
import {
  Plus,
  Search,
  Filter,
  Eye,
  BookOpen,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

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
  totalAttempts: number;
  _count?: {
    examQuestions: number;
    examResults: number;
  };
}

// Table columns definition
const createExamColumns = (
  getDifficultyColor: (difficulty: string) => string,
  getCategoryColor: (category: string) => string
): ColumnDef<Exam, unknown>[] => [
  {
    accessorKey: "title",
    header: "Exam",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="text-sm font-medium text-gray-900 truncate">
          {row.original.title}
        </div>
        <div className="text-sm text-gray-500 line-clamp-2">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <div className="space-y-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
              row.original.difficulty
            )}`}
          >
            {row.original.difficulty}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
              row.original.category
            )}`}
          >
            {row.original.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
          <Clock className="w-4 h-4" />
          <span>{row.original.duration} min</span>
          {row.original.enableOverallTimer && (
            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
              Timer
            </span>
          )}
          {row.original.enableTimedQuestions && (
            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
              Q-Timer
            </span>
          )}
        </div>
        {row.original.targetRole && (
          <div className="text-sm text-gray-500 truncate">
            {row.original.targetRole}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "stats",
    header: "Stats",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="text-sm text-gray-900">
          {row.original.totalQuestions} questions
        </div>
        <div className="text-sm text-gray-500">
          {row.original.totalAttempts} attempts
        </div>
        <div className="text-sm text-gray-500">
          {row.original.passingScore}% passing
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {row.original.isActive ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </span>
        )}
        {row.original.isPublic && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Public
          </span>
        )}
      </div>
    ),
  },
];

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExams, setTotalExams] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // API Debug state
  const [apiRequest, setApiRequest] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        difficulty: difficultyFilter,
        category: categoryFilter,
      });

      // Only add isActive if it has a value
      if (statusFilter) {
        params.append("isActive", statusFilter);
      }

      const requestData = {
        endpoint: `/api/exams?${params}`,
        method: "GET",
        params: Object.fromEntries(params.entries()),
      };
      setApiRequest(requestData);

      console.log("🔍 Fetching exams with params:", params.toString());
      const response = await fetch(`/api/exams?${params}`);
      const result = await response.json();
      console.log("📥 API Response:", result);

      setApiResponse(result);

      if (result.success) {
        console.log("✅ Setting exams:", result.data.length, "exams");
        setExams(result.data);
        setTotalPages(result.pagination.pages);
        setTotalExams(result.pagination.total);
      } else {
        console.error("❌ API returned error:", result.error);
        setApiError(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("❌ Error fetching exams:", error);
      setApiError(error instanceof Error ? error.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [currentPage, searchTerm, difficultyFilter, categoryFilter, statusFilter]);

  const handleDelete = async (examId: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      try {
        const response = await fetch(`/api/exams/${examId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchExams();
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  // Action handlers for the advanced table
  const handleViewExam = (exam: Exam) => {
    window.location.href = `/admin/exams/${exam.id}`;
  };

  const handleEditExam = (exam: Exam) => {
    window.location.href = `/admin/exams/${exam.id}/edit`;
  };

  const handleDeleteExam = async (exam: Exam) => {
    if (confirm(`Are you sure you want to delete "${exam.title}"?`)) {
      try {
        const response = await fetch(`/api/exams/${exam.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refetch data after successful delete
          await fetchExams();
        }
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const handleDuplicateExam = async (exam: Exam) => {
    if (confirm(`Are you sure you want to duplicate "${exam.title}"?`)) {
      try {
        const response = await fetch(`/api/exams/${exam.id}/duplicate`, {
          method: "POST",
        });

        const result = await response.json();

        if (result.success) {
          // Show success message
          alert(result.message);
          // Refetch data to show the new duplicated exam
          await fetchExams();
        } else {
          // Show error message
          alert(`Error: ${result.error}`);
          if (result.details) {
            console.error("Validation errors:", result.details);
          }
        }
      } catch (error) {
        console.error("Error duplicating exam:", error);
        alert("Failed to duplicate exam. Please try again.");
      }
    }
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    if (
      confirm(`Are you sure you want to delete ${selectedIds.length} exams?`)
    ) {
      try {
        const promises = selectedIds.map((id) =>
          fetch(`/api/exams/${id}`, { method: "DELETE" })
        );
        await Promise.all(promises);
        // Refetch data after successful bulk delete
        await fetchExams();
      } catch (error) {
        console.error("Error bulk deleting exams:", error);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "programming":
        return "bg-blue-100 text-blue-800";
      case "data-structures":
        return "bg-purple-100 text-purple-800";
      case "algorithms":
        return "bg-indigo-100 text-indigo-800";
      case "database":
        return "bg-green-100 text-green-800";
      case "web-development":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Debug: Check if data is being received
  console.log("🔍 Debug - exams length:", exams.length, "loading:", loading);
  if (exams.length > 0) {
    console.log("📋 First exam:", exams[0]);
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        {/* API Debug Panel */}
        <ApiDebugPanel
          title="Exams API Debug"
          endpoint="/api/exams"
          method="GET"
          requestData={apiRequest}
          responseData={apiResponse}
          loading={loading}
          error={apiError}
          className="mb-4"
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Exams Management
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage exams for your students
            </p>
          </div>
          <Button
            onClick={() => (window.location.href = "/admin/exams/add")}
            className="flex items-center w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Exams
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalExams}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Exams
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {exams.filter((exam) => exam.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Attempts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {exams.reduce((sum, exam) => sum + exam.totalAttempts, 0)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Questions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {exams.length > 0
                      ? Math.round(
                          exams.reduce(
                            (sum, exam) => sum + exam.totalQuestions,
                            0
                          ) / exams.length
                        )
                      : 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="p-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="Programming">Programming</option>
                  <option value="data-structures">Data Structures</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="database">Database</option>
                  <option value="web-development">Web Development</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Exams List */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loading size="lg" text="Loading exams..." />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No exams found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ||
                difficultyFilter ||
                categoryFilter ||
                statusFilter
                  ? "Try adjusting your filters or search terms."
                  : "Get started by creating your first exam."}
              </p>
              <Button
                onClick={() => (window.location.href = "/admin/exams/add")}
                className="flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Exam
              </Button>
            </div>
          ) : (
            <AdvancedListView<Exam>
              data={exams}
              onEdit={handleEditExam}
              onDelete={handleDeleteExam}
              onView={handleViewExam}
              onDuplicate={handleDuplicateExam}
              onBulkDelete={handleBulkDelete}
              className="w-full"
              renderItem={(exam) => (
                <>
                  {/* Exam Title and Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {exam.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {exam.description}
                    </p>
                  </div>

                  {/* Exam Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty & Category
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                            exam.difficulty
                          )}`}
                        >
                          {exam.difficulty}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            exam.category
                          )}`}
                        >
                          {exam.category}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration & Settings
                      </span>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} min</span>
                        {exam.enableOverallTimer && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            Timer
                          </span>
                        )}
                        {exam.enableTimedQuestions && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            Q-Timer
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stats
                      </span>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {exam.totalQuestions} questions
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.totalAttempts} attempts
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.passingScore}% passing
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </span>
                    <div className="flex items-center space-x-2">
                      {exam.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                      {exam.isPublic && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Public
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target Role */}
                  {exam.targetRole && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target Role
                      </span>
                      <div className="text-sm text-gray-500">
                        {exam.targetRole}
                      </div>
                    </div>
                  )}
                </>
              )}
            />
          )}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({totalExams} total
                exams)
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
