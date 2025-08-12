"use client";

import { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Plus,
  Code,
  Calendar,
  Tag,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  subject?: string;
  topic?: string;
  tool?: string;
  technologyStack?: string;
  domain?: string;
  skillLevel?: string;
  jobRole?: string;
  companyType?: string;
  interviewType?: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
  priority?: string;
  status?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    submissions: number;
  };
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/problems");
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setProblems(result.data);
        } else {
          console.error("Invalid response format:", result);
          setProblems([]);
        }
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.tags &&
        problem.tags.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty =
      !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesCategory =
      !selectedCategory || problem.category === selectedCategory;
    const matchesStatus = !selectedStatus || problem.status === selectedStatus;
    const matchesSubject =
      !selectedSubject || problem.subject === selectedSubject;

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesCategory &&
      matchesStatus &&
      matchesSubject
    );
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "draft":
        return "text-yellow-600 bg-yellow-100";
      case "archived":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Code className="w-8 h-8 mr-3 text-blue-600" />
                Coding Problems
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all uploaded coding problems
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => (window.location.href = "/admin/problems/add")}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Problem
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = "/admin/upload?type=problems")
                }
                variant="outline"
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Code className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Problems
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {problems.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {problems.filter((p) => p.status === "active").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {problems.filter((p) => p.status === "draft").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {problems.reduce(
                      (sum, p) => sum + (p._count?.submissions || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedDifficulty("");
                setSelectedCategory("");
                setSelectedStatus("");
                setSelectedSubject("");
              }}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="algorithms">Algorithms</option>
                <option value="data-structures">Data Structures</option>
                <option value="arrays">Arrays</option>
                <option value="strings">Strings</option>
                <option value="linked-lists">Linked Lists</option>
                <option value="stacks-queues">Stacks & Queues</option>
                <option value="trees">Trees</option>
                <option value="graphs">Graphs</option>
                <option value="dynamic-programming">Dynamic Programming</option>
                <option value="greedy-algorithms">Greedy Algorithms</option>
                <option value="backtracking">Backtracking</option>
                <option value="binary-search">Binary Search</option>
                <option value="sorting">Sorting</option>
                <option value="hashing">Hashing</option>
                <option value="recursion">Recursion</option>
                <option value="bit-manipulation">Bit Manipulation</option>
                <option value="math">Math</option>
                <option value="design-patterns">Design Patterns</option>
                <option value="system-design">System Design</option>
                <option value="database-design">Database Design</option>
                <option value="api-design">API Design</option>
                <option value="security">Security</option>
                <option value="testing">Testing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                <option value="programming">Programming</option>
                <option value="data-science">Data Science</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="devops">DevOps</option>
                <option value="ai-ml">AI/ML</option>
                <option value="database">Database</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="system-design">System Design</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredProblems.length}</span> of{" "}
            <span className="font-semibold">{problems.length}</span> problems
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {problem.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          problem.status || "draft"
                        )}`}
                      >
                        {problem.status || "draft"}
                      </span>
                      {problem.priority && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            problem.priority
                          )}`}
                        >
                          {problem.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {problem.description}
                </p>

                {/* Tags */}
                {problem.tags && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags
                        .split(",")
                        .slice(0, 3)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      {problem.tags.split(",").length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{problem.tags.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {problem.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {problem.category}
                    </div>
                  )}
                  {problem.subject && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Code className="w-4 h-4 mr-2" />
                      {problem.subject}
                    </div>
                  )}
                  {problem._count && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {problem._count.submissions} submissions
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No problems found
            </h3>
            <p className="text-gray-600 mb-4">
              {problems.length === 0
                ? "No problems have been uploaded yet."
                : "Try adjusting your search or filter criteria."}
            </p>
            {problems.length === 0 && (
              <div className="flex space-x-3">
                <Button
                  onClick={() => (window.location.href = "/admin/problems/add")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Problem
                </Button>
                <Button
                  onClick={() =>
                    (window.location.href = "/admin/upload?type=problems")
                  }
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload Problems
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
