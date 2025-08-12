"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  BookOpen,
  Target,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  targetRole?: string;
  questionTypes: string;
  totalQuestions: number;
  passingScore: number;
  isActive: boolean;
  isPublic: boolean;
  totalAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExams, setTotalExams] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const difficulties = ["Easy", "Medium", "Hard"];
  const questionTypes = ["MCQ", "Coding", "Aptitude", "Mixed"];
  const categories = [
    // Technical Categories
    "Programming",
    "Data Structures",
    "Algorithms",
    "Web Development",
    "Database",
    "System Design",
    "Frontend",
    "Backend",
    "Full Stack",
    "Mobile Development",
    "DevOps",
    "Machine Learning",
    // Non-Technical Categories
    "Aptitude",
    "Logical Reasoning",
    "Verbal Ability",
    "Quantitative Aptitude",
    "General Knowledge",
    "English Language",
    "Business Communication",
    "Problem Solving",
    "Critical Thinking",
    "Team Management",
    "Leadership",
    "Project Management",
  ];

  useEffect(() => {
    fetchExams();
  }, [currentPage, searchTerm, difficultyFilter, categoryFilter, statusFilter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        difficulty: difficultyFilter,
        category: categoryFilter,
        isActive: statusFilter,
      });

      const response = await fetch(`/api/exams?${params}`);
      const result = await response.json();

      if (result.success) {
        setExams(result.data);
        setTotalPages(result.pagination.pages);
        setTotalExams(result.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        fetchExams();
      } else {
        alert("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      alert("Failed to delete exam");
    }
  };

  const handleToggleStatus = async (examId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        fetchExams();
      } else {
        alert("Failed to update exam status");
      }
    } catch (error) {
      console.error("Error updating exam status:", error);
      alert("Failed to update exam status");
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
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800",
      "bg-emerald-100 text-emerald-800",
      "bg-rose-100 text-rose-800",
    ];
    return colors[Math.abs(category.length) % colors.length];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("");
    setCategoryFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center mb-2">
              <BookOpen className="w-8 h-8 mr-3" />
              Exams Management
            </h1>
            <p className="text-green-100 text-lg">
              Create and manage comprehensive exams for fresh graduates - Technical & Non-Technical
            </p>
                          <div className="flex items-center mt-4 space-x-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                  <span>Technical & Aptitude</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-300" />
                  <span>Timed Assessments</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-300" />
                  <span>Performance Analytics</span>
                </div>
              </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">📝</div>
                <div className="text-sm opacity-90">Exam Center</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Exams</p>
              <p className="text-2xl font-bold text-blue-900">{totalExams}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Active Exams</p>
              <p className="text-2xl font-bold text-green-900">
                {exams.filter((exam) => exam.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Total Attempts</p>
              <p className="text-2xl font-bold text-purple-900">
                {exams.reduce((sum, exam) => sum + exam.totalAttempts, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Avg Questions</p>
              <p className="text-2xl font-bold text-orange-900">
                {exams.length > 0
                  ? Math.round(
                      exams.reduce((sum, exam) => sum + exam.totalQuestions, 0) /
                        exams.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={() => (window.location.href = "/admin/exams/add")}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Exam
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/exams/templates")}
              variant="outline"
              className="flex items-center"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              onClick={() => (window.location.href = "/admin/exams/upload")}
              variant="outline"
              className="flex items-center"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exams by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
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
              {searchTerm || difficultyFilter || categoryFilter || statusFilter
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {exam.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.description.length > 60
                            ? `${exam.description.substring(0, 60)}...`
                            : exam.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                              exam.difficulty
                            )}`}
                          >
                            {exam.difficulty}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              exam.category
                            )}`}
                          >
                            {exam.category}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {exam.duration} min
                        </div>
                        {exam.targetRole && (
                          <div className="text-sm text-gray-500">
                            {exam.targetRole}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() =>
                            (window.location.href = `/admin/exams/${exam.id}`)
                          }
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            (window.location.href = `/admin/exams/${exam.id}/questions`)
                          }
                          variant="outline"
                          size="sm"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            (window.location.href = `/admin/exams/${exam.id}/edit`)
                          }
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(exam.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages} (
              {totalExams} total exams)
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
  );
}
