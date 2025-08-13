"use client";

import { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import {
  FileText,
  Code,
  Target,
  Plus,
  Upload,
  BarChart3,
  Users,
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package,
} from "lucide-react";

interface ContentStats {
  totalExams: number;
  totalProblems: number;
  totalMCQs: number;
  activeExams: number;
  activeProblems: number;
  activeMCQs: number;
  recentExams: number;
  recentProblems: number;
  recentMCQs: number;
}

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "problems" | "mcqs">(
    "exams"
  );
  const [stats, setStats] = useState<ContentStats>({
    totalExams: 0,
    totalProblems: 0,
    totalMCQs: 0,
    activeExams: 0,
    activeProblems: 0,
    activeMCQs: 0,
    recentExams: 0,
    recentProblems: 0,
    recentMCQs: 0,
  });

  const tabs = [
    {
      id: "exams" as const,
      name: "Exams",
      icon: FileText,
      description: "Create & Manage Exams",
      href: "/admin/exams",
    },
    {
      id: "problems" as const,
      name: "Coding Problems",
      icon: Code,
      description: "View & Manage Problems",
      href: "/admin/problems",
    },
    {
      id: "mcqs" as const,
      name: "MCQ Questions",
      icon: Target,
      description: "View & Manage MCQs",
      href: "/admin/mcq",
    },
  ];

  const getTabIcon = (icon: any) => {
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Content Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your exam content, coding problems, and MCQ questions
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() =>
                  (window.location.href = `/admin/${activeTab}/add`)
                }
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add{" "}
                {activeTab === "exams"
                  ? "Exam"
                  : activeTab === "problems"
                  ? "Problem"
                  : "MCQ"}
              </Button>
              <Button
                onClick={() =>
                  (window.location.href = `/admin/${activeTab}/upload`)
                }
                variant="outline"
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Content Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalExams}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>{stats.activeExams} active</span>
              <span className="mx-2">•</span>
              <span>{stats.recentExams} recent</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Coding Problems
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProblems}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>{stats.activeProblems} active</span>
              <span className="mx-2">•</span>
              <span>{stats.recentProblems} recent</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  MCQ Questions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMCQs}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>{stats.activeMCQs} active</span>
              <span className="mx-2">•</span>
              <span>{stats.recentMCQs} recent</span>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {getTabIcon(tab.icon)}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "exams" && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Exam Management
                </h3>
                <p className="text-gray-600 mb-6">
                  Create and manage exams with questions from your MCQ and
                  problem libraries.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    onClick={() => (window.location.href = "/admin/exams")}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Exams
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/admin/exams/add")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Exam
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "problems" && (
              <div className="text-center py-12">
                <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Coding Problems
                </h3>
                <p className="text-gray-600 mb-6">
                  Manage coding problems with test cases and solutions for
                  programming practice.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    onClick={() => (window.location.href = "/admin/problems")}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All Problems
                  </Button>
                  <Button
                    onClick={() =>
                      (window.location.href = "/admin/problems/add")
                    }
                    variant="outline"
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Problem
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "mcqs" && (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  MCQ Questions
                </h3>
                <p className="text-gray-600 mb-6">
                  Manage multiple choice questions with explanations and
                  difficulty levels.
                </p>
                <div className="flex space-x-3 justify-center">
                  <Button
                    onClick={() => (window.location.href = "/admin/mcq")}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View All MCQs
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/admin/mcq/add")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New MCQ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Content Analytics
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              View detailed analytics and performance metrics for your content
            </p>
            <Button
              onClick={() => (window.location.href = "/admin/analytics")}
              variant="outline"
              className="w-full"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Bulk Operations
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload multiple questions or problems at once using CSV/JSON files
            </p>
            <Button
              onClick={() => (window.location.href = "/admin/upload")}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </Card>

          <Card className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Seed Management
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Manage question seeds and templates for quick content creation
            </p>
            <Button
              onClick={() => (window.location.href = "/admin/seeds")}
              variant="outline"
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Seeds
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
