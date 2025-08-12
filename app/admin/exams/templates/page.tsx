"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  BookOpen,
  ArrowLeft,
  Copy,
  CheckCircle,
  Clock,
  Target,
  Users,
  Brain,
  Code,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";

interface ExamTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  questionTypes: string;
  totalQuestions: number;
  passingScore: number;
  targetRole: string;
  tags: string[];
  icon: string;
  color: string;
}

export default function ExamTemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ExamTemplate | null>(null);

  const examTemplates: ExamTemplate[] = [
    // Technical Templates
    {
      id: "js-fundamentals",
      title: "JavaScript Fundamentals",
      description: "Basic JavaScript concepts, syntax, and programming logic for fresh graduates",
      category: "Programming",
      difficulty: "Easy",
      duration: 45,
      questionTypes: "Mixed",
      totalQuestions: 15,
      passingScore: 65,
      targetRole: "Frontend Developer",
      tags: ["JavaScript", "ES6", "DOM", "Functions", "Arrays"],
      icon: "💻",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "web-basics",
      title: "Web Development Basics",
      description: "HTML, CSS, and basic web concepts for entry-level developers",
      category: "Web Development",
      difficulty: "Easy",
      duration: 60,
      questionTypes: "Mixed",
      totalQuestions: 20,
      passingScore: 60,
      targetRole: "Frontend Developer",
      tags: ["HTML", "CSS", "Responsive Design", "Web Standards"],
      icon: "🌐",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "data-structures",
      title: "Data Structures & Algorithms",
      description: "Fundamental data structures and basic algorithms for technical interviews",
      category: "Data Structures",
      difficulty: "Medium",
      duration: 90,
      questionTypes: "Mixed",
      totalQuestions: 25,
      passingScore: 70,
      targetRole: "Software Engineer",
      tags: ["Arrays", "Linked Lists", "Trees", "Sorting", "Searching"],
      icon: "🔗",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "sql-basics",
      title: "SQL & Database Fundamentals",
      description: "Basic SQL queries, database concepts, and data modeling",
      category: "Database",
      difficulty: "Easy",
      duration: 45,
      questionTypes: "MCQ",
      totalQuestions: 15,
      passingScore: 65,
      targetRole: "Backend Developer",
      tags: ["SQL", "MySQL", "Database Design", "Queries"],
      icon: "🗄️",
      color: "from-orange-500 to-red-500",
    },
    
    // Non-Technical Templates
    {
      id: "aptitude-basic",
      title: "Basic Aptitude Test",
      description: "Numerical, verbal, and logical reasoning for general aptitude assessment",
      category: "Aptitude",
      difficulty: "Easy",
      duration: 60,
      questionTypes: "MCQ",
      totalQuestions: 30,
      passingScore: 60,
      targetRole: "Business Analyst",
      tags: ["Numerical", "Verbal", "Logical", "Reasoning"],
      icon: "🧠",
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "communication",
      title: "Business Communication",
      description: "English language skills, business writing, and professional communication",
      category: "Business Communication",
      difficulty: "Medium",
      duration: 45,
      questionTypes: "MCQ",
      totalQuestions: 20,
      passingScore: 70,
      targetRole: "Marketing Executive",
      tags: ["English", "Writing", "Communication", "Business"],
      icon: "💬",
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "problem-solving",
      title: "Problem Solving & Critical Thinking",
      description: "Analytical thinking, decision making, and problem-solving scenarios",
      category: "Problem Solving",
      difficulty: "Medium",
      duration: 75,
      questionTypes: "Mixed",
      totalQuestions: 25,
      passingScore: 65,
      targetRole: "Project Manager",
      tags: ["Analytical", "Decision Making", "Critical Thinking"],
      icon: "🎯",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "leadership",
      title: "Leadership & Team Management",
      description: "Leadership skills, team dynamics, and project management concepts",
      category: "Leadership",
      difficulty: "Medium",
      duration: 60,
      questionTypes: "MCQ",
      totalQuestions: 20,
      passingScore: 70,
      targetRole: "Project Manager",
      tags: ["Leadership", "Team Management", "Project Management"],
      icon: "👥",
      color: "from-rose-500 to-pink-500",
    },
  ];

  const handleCreateFromTemplate = async (template: ExamTemplate) => {
    setLoading(true);
    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          duration: template.duration,
          difficulty: template.difficulty,
          category: template.category,
          targetRole: template.targetRole,
          questionTypes: template.questionTypes,
          totalQuestions: template.totalQuestions,
          passingScore: template.passingScore,
          isActive: true,
          isPublic: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Exam created successfully from template!");
        window.location.href = "/admin/exams";
      } else {
        alert(result.error || "Failed to create exam from template");
      }
    } catch (error) {
      console.error("Error creating exam from template:", error);
      alert("Failed to create exam from template");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Programming": "bg-blue-100 text-blue-800",
      "Web Development": "bg-green-100 text-green-800",
      "Data Structures": "bg-purple-100 text-purple-800",
      "Database": "bg-orange-100 text-orange-800",
      "Aptitude": "bg-indigo-100 text-indigo-800",
      "Business Communication": "bg-teal-100 text-teal-800",
      "Problem Solving": "bg-yellow-100 text-yellow-800",
      "Leadership": "bg-rose-100 text-rose-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <BookOpen className="w-8 h-8 mr-3" />
                Exam Templates
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/exams")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Exams
              </Button>
            </div>
            <p className="text-indigo-100 text-lg">
              Pre-configured exam templates for quick setup - Technical & Non-Technical
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-indigo-300" />
                <span>Ready-to-use Templates</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-indigo-300" />
                <span>Optimized Settings</span>
              </div>
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-2 text-indigo-300" />
                <span>Fresh Graduate Focus</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">📋</div>
                <div className="text-sm opacity-90">Templates</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Templates */}
        <Card>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Code className="w-6 h-6 mr-3 text-blue-600" />
              Technical Templates
            </h3>
            <p className="text-gray-700 mb-6">
              Programming, web development, data structures, and technical skills assessment
            </p>
            <div className="space-y-4">
              {examTemplates
                .filter((template) => 
                  ["Programming", "Web Development", "Data Structures", "Database"].includes(template.category)
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <h4 className="font-semibold text-gray-900">{template.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {template.duration} min
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>{template.totalQuestions} questions</span>
                          <span>{template.passingScore}% passing</span>
                          <span>{template.targetRole}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCreateFromTemplate(template)}
                        disabled={loading}
                        size="sm"
                        className="ml-4"
                      >
                        {loading ? (
                          <Loading size="sm" text="Creating..." />
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Non-Technical Templates */}
        <Card>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-600" />
              Non-Technical Templates
            </h3>
            <p className="text-gray-700 mb-6">
              Aptitude, communication, problem-solving, and soft skills assessment
            </p>
            <div className="space-y-4">
              {examTemplates
                .filter((template) => 
                  ["Aptitude", "Business Communication", "Problem Solving", "Leadership"].includes(template.category)
                )
                .map((template) => (
                  <div
                    key={template.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{template.icon}</span>
                          <h4 className="font-semibold text-gray-900">{template.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {template.duration} min
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>{template.totalQuestions} questions</span>
                          <span>{template.passingScore}% passing</span>
                          <span>{template.targetRole}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCreateFromTemplate(template)}
                        disabled={loading}
                        size="sm"
                        className="ml-4"
                      >
                        {loading ? (
                          <Loading size="sm" text="Creating..." />
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Use Template
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Template Benefits */}
      <Card>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3 text-green-600" />
            Why Use Templates?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">
                Pre-configured settings optimized for fresh graduates
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proven Structure</h4>
              <p className="text-sm text-gray-600">
                Tested exam formats with appropriate difficulty levels
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fresh Graduate Focus</h4>
              <p className="text-sm text-gray-600">
                Designed specifically for entry-level candidates
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
