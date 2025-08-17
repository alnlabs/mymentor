"use client";

import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Loading } from "./Loading";
import {
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Code,
  Plus,
  X,
} from "lucide-react";

interface Question {
  id: string;
  title?: string;
  question?: string;
  content?: string;
  type: "mcq" | "problem";
  difficulty: string;
  category: string;
  subject?: string;
  tool?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
}

interface QuestionSelectorProps {
  onQuestionsSelected: (questions: Question[]) => void;
  selectedQuestions: Question[];
  className?: string;
  questionTypes?: {
    mcq: boolean;
    problem: boolean;
  };
}

export default function QuestionSelector({
  onQuestionsSelected,
  selectedQuestions,
  className = "",
  questionTypes,
}: QuestionSelectorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    language: "JavaScript",
    topic: "General",
    difficulty: "intermediate",
    type: "all" as "all" | "mcq" | "problem",
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const languages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "TypeScript",
    "Go",
    "Rust",
    "PHP",
  ];

  const topics = [
    "General",
    "Algorithms",
    "Data Structures",
    "Web Development",
    "Database",
    "System Design",
    "Machine Learning",
    "DevOps",
  ];

  const difficulties = ["beginner", "intermediate", "advanced"];

  // Update type filter based on questionTypes prop
  useEffect(() => {
    if (questionTypes) {
      if (questionTypes.mcq && questionTypes.problem) {
        setFilters(prev => ({ ...prev, type: "all" }));
      } else if (questionTypes.mcq) {
        setFilters(prev => ({ ...prev, type: "mcq" }));
      } else if (questionTypes.problem) {
        setFilters(prev => ({ ...prev, type: "problem" }));
      }
    }
  }, [questionTypes]);

  const fetchQuestions = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const queryParams = new URLSearchParams({
        language: filters.language,
        topic: filters.topic,
        difficulty: filters.difficulty,
        type: filters.type,
        limit: filters.limit.toString(),
        search: searchTerm,
      });

      const response = await fetch(`/api/questions/search?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setQuestions(result.data || []);
        setMessage({
          type: "success",
          text: `Found ${
            result.data?.length || 0
          } questions matching your criteria.`,
        });
      } else {
        throw new Error(result.error || "Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch questions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters, searchTerm]);

  const handleQuestionToggle = (question: Question) => {
    const isSelected = selectedQuestions.some((q) => q.id === question.id);

    if (isSelected) {
      onQuestionsSelected(
        selectedQuestions.filter((q) => q.id !== question.id)
      );
    } else {
      onQuestionsSelected([...selectedQuestions, question]);
    }
  };

  const isQuestionSelected = (questionId: string) => {
    return selectedQuestions.some((q) => q.id === questionId);
  };

  const clearFilters = () => {
    setFilters({
      language: "JavaScript",
      topic: "General",
      difficulty: "intermediate",
      type: "all",
      limit: 20,
    });
    setSearchTerm("");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Question Selector
            </h3>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {selectedQuestions.length} Selected
            </span>
          </div>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, topic: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  type: e.target.value as "all" | "mcq" | "problem",
                }))
              }
              disabled={!!questionTypes}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                questionTypes ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              <option value="all">All Types</option>
              <option value="mcq">MCQ Only</option>
              <option value="problem">Problems Only</option>
            </select>
            {questionTypes && (
              <p className="text-xs text-gray-500 mt-1">
                Controlled by exam settings
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limit
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={50}>50 Questions</option>
              <option value={100}>100 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={fetchQuestions}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <>
                <Loading size="sm" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search Questions
              </>
            )}
          </Button>

          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Questions ({questions.length})
            </h3>
            <div className="text-sm text-gray-500">
              Click to select/deselect questions
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {questions.map((question) => {
              const isSelected = isQuestionSelected(question.id);
              const questionText =
                question.title ||
                question.question ||
                question.content ||
                "No content";

              return (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleQuestionToggle(question)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {question.type === "mcq" ? (
                          <BookOpen className="w-4 h-4 text-green-600" />
                        ) : (
                          <Code className="w-4 h-4 text-purple-600" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {question.type.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {question.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {question.category}
                        </span>
                        {question.tool && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                            {question.tool}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {questionText}
                      </p>
                    </div>
                    <div className="ml-4">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Selected Questions Summary */}
      {selectedQuestions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Questions ({selectedQuestions.length})
            </h3>
            <Button
              onClick={() => onQuestionsSelected([])}
              variant="outline"
              size="sm"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            {selectedQuestions.map((question) => (
              <div
                key={question.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  {question.type === "mcq" ? (
                    <BookOpen className="w-4 h-4 text-green-600" />
                  ) : (
                    <Code className="w-4 h-4 text-purple-600" />
                  )}
                  <span className="text-sm font-medium">
                    {question.title ||
                      question.question ||
                      question.content ||
                      "No content"}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">
                    {question.difficulty}
                  </span>
                </div>
                <Button
                  onClick={() => handleQuestionToggle(question)}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
