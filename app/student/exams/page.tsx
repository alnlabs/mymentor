"use client";

import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/shared/components/AuthContext";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ExamsPage() {
  const { user, loading, isAdmin, isSuperAdmin } = useAuthContext();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Redirect to homepage if not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [user, loading]);

  // Redirect admin/superadmin to admin area
  React.useEffect(() => {
    if (!loading && user && (isAdmin || isSuperAdmin)) {
      window.location.href = "/admin";
    }
  }, [user, loading, isAdmin, isSuperAdmin]);

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  useEffect(() => {
    filterExams();
  }, [exams, searchTerm, selectedDifficulty, selectedCategory]);

  const fetchExams = async () => {
    try {
      setLoadingExams(true);
      const response = await fetch("/api/exams?isActive=true");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExams(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  const filterExams = () => {
    let filtered = exams;

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
      filtered = filtered.filter((exam) => exam.difficulty === selectedDifficulty);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((exam) => exam.category === selectedCategory);
    }

    setFilteredExams(filtered);
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

  if (loading || loadingExams) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const difficulties = [...new Set(exams.map((exam) => exam.difficulty))];
  const categories = [...new Set(exams.map((exam) => exam.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyMentor Exams
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/student/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/student/interviews"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Interviews
              </a>
              <a
                href="/student/feedback"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>
      </header>

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
                Test your knowledge with comprehensive exams designed for fresh graduates.
                Practice with real interview questions and improve your skills.
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Available Exams ({filteredExams.length})
            </h3>
          </div>

          {filteredExams.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No exams found
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedDifficulty || selectedCategory
                  ? "Try adjusting your search criteria."
                  : "Check back later for new exams."}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => (
                <Card
                  key={exam.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {getCategoryIcon(exam.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {exam.title}
                          </h3>
                          <p className="text-sm text-gray-500">{exam.category}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                          exam.difficulty
                        )}`}
                      >
                        {exam.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exam.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>{exam.totalQuestions} questions</span>
                      </div>
                    </div>

                    {/* Passing Score */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                      <Award className="w-4 h-4" />
                      <span>Passing Score: {exam.passingScore}%</span>
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
        </div>

        {/* Tips Section */}
        <div className="mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Exam Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Before the Exam:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Read the instructions carefully</li>
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Find a quiet environment to focus</li>
                  <li>• Have a calculator ready if needed</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">During the Exam:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Manage your time wisely</li>
                  <li>• Read questions thoroughly</li>
                  <li>• Don't spend too long on difficult questions</li>
                  <li>• Review your answers before submitting</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
