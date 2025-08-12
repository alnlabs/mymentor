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
  FileText,
  Calendar,
  Tag,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Brain,
  BookOpen,
} from "lucide-react";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
  difficulty: string;
  tags?: string;
  companies?: string;
  priority?: string;
  status?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMCQPage() {
  const [mcqs, setMcqs] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      const response = await fetch("/api/mcq");
      if (response.ok) {
        const data = await response.json();
        // Flatten the MCQ sets to get individual questions
        const allMCQs = data.flatMap((set: any) => set.questions || []);
        setMcqs(allMCQs);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMCQs = mcqs.filter((mcq) => {
    const matchesSearch =
      mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mcq.explanation &&
        mcq.explanation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mcq.tags && mcq.tags.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty =
      !selectedDifficulty || mcq.difficulty === selectedDifficulty;
    const matchesCategory =
      !selectedCategory || mcq.category === selectedCategory;
    const matchesStatus = !selectedStatus || mcq.status === selectedStatus;
    const matchesSubject = !selectedSubject || mcq.subject === selectedSubject;

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
                <FileText className="w-8 h-8 mr-3 text-purple-600" />
                MCQ Questions
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all uploaded MCQ questions
              </p>
            </div>
            <Button
              onClick={() => (window.location.href = "/admin/mcq/add")}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New MCQ
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Total MCQs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mcqs.length}
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
                    {mcqs.filter((m) => m.status === "active").length}
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
                    {mcqs.filter((m) => m.status === "draft").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Categories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(mcqs.map((m) => m.category)).size}
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
                  placeholder="Search MCQs..."
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
            Showing <span className="font-semibold">{filteredMCQs.length}</span>{" "}
            of <span className="font-semibold">{mcqs.length}</span> MCQs
          </p>
        </div>

        {/* MCQs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMCQs.map((mcq) => (
            <Card
              key={mcq.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3">
                      {mcq.question}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          mcq.difficulty
                        )}`}
                      >
                        {mcq.difficulty}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          mcq.status || "draft"
                        )}`}
                      >
                        {mcq.status || "draft"}
                      </span>
                      {mcq.priority && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            mcq.priority
                          )}`}
                        >
                          {mcq.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Options Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Options:
                  </h4>
                  <div className="space-y-1">
                    {mcq.options.slice(0, 2).map((option, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span
                          className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                            index === mcq.correctAnswer
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {index === mcq.correctAnswer
                            ? "✓"
                            : String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-600 line-clamp-1">
                          {option}
                        </span>
                      </div>
                    ))}
                    {mcq.options.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{mcq.options.length - 2} more options
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {mcq.tags && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {mcq.tags
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
                      {mcq.tags.split(",").length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{mcq.tags.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {mcq.category && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Tag className="w-4 h-4 mr-2" />
                      {mcq.category}
                    </div>
                  )}
                  {mcq.subject && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {mcq.subject}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(mcq.createdAt).toLocaleDateString()}
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

        {filteredMCQs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No MCQs found
            </h3>
            <p className="text-gray-600 mb-4">
              {mcqs.length === 0
                ? "No MCQ questions have been uploaded yet."
                : "Try adjusting your search or filter criteria."}
            </p>
            {mcqs.length === 0 && (
              <Button onClick={() => (window.location.href = "/admin/mcq/add")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First MCQ
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
