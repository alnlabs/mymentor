"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { Search, Filter, BookOpen, Clock, Users, Target, LogOut, Home, Code, Target as TargetIcon, BarChart3, Settings } from "lucide-react";

interface MCQ {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  questionCount: number;
  participants: number;
  averageScore: number;
}

export default function MCQPage() {
  const { user, loading, isAdmin, isSuperAdmin, signOutUser } = useAuthContext();
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [filteredMcqs, setFilteredMcqs] = useState<MCQ[]>([]);
  const [loadingMcqs, setLoadingMcqs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchMCQs();
  }, []);

  useEffect(() => {
    filterMCQs();
  }, [mcqs, searchTerm, difficultyFilter, categoryFilter]);

  const fetchMCQs = async () => {
    try {
      const response = await fetch("/api/mcq");
      if (response.ok) {
        const data = await response.json();
        setMcqs(data.data || []);
      } else {
        console.error("Failed to fetch MCQs");
        setMcqs([]);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
      setMcqs([]);
    } finally {
      setLoadingMcqs(false);
    }
  };

  const filterMCQs = () => {
    let filtered = mcqs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (mcq) =>
          mcq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mcq.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mcq.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((mcq) => mcq.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((mcq) => mcq.category === categoryFilter);
    }

    setFilteredMcqs(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "🟢";
      case "medium":
        return "🟡";
      case "hard":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const categories = Array.from(new Set(mcqs.map((m) => m.category)));

  if (loading || loadingMcqs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Loading size="lg" text="Loading MCQs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                MCQ Questions
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                <a
                  href="/problems"
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>Problems</span>
                </a>
                <a
                  href="/mcq"
                  className="flex items-center space-x-2 text-purple-600 font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>MCQs</span>
                </a>
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin/interviews"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <TargetIcon className="w-4 h-4" />
                    <span>Interviews</span>
                  </a>
                )}
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin/users"
                    className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>Users</span>
                  </a>
                )}
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin/analytics"
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Analytics</span>
                  </a>
                )}
                {(isAdmin || isSuperAdmin) && (
                  <a
                    href="/admin/settings"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                )}
              </nav>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {isSuperAdmin ? "S" : user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium hidden sm:block">
                  {isSuperAdmin ? "SuperAdmin" : user?.displayName || user?.email || "User"}
                </span>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={signOutUser}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search MCQs by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMcqs.length} of {mcqs.length} MCQs
          </p>
        </div>

        {/* MCQs Grid */}
        {filteredMcqs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No MCQs found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMcqs.map((mcq) => (
              <Card
                key={mcq.id}
                className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
                onClick={() => window.location.href = `/mcq/${mcq.id}`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {mcq.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        mcq.difficulty
                      )}`}
                    >
                      {getDifficultyIcon(mcq.difficulty)} {mcq.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {mcq.description}
                  </p>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {mcq.category}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{mcq.timeLimit}min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{mcq.questionCount} Qs</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{mcq.participants}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className={`w-4 h-4 ${getScoreColor(mcq.averageScore)}`} />
                        <span className={getScoreColor(mcq.averageScore)}>
                          {mcq.averageScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
