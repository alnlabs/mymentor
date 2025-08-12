"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Plus,
  ArrowLeft,
  Target,
  Clock,
  Save,
  Trash2,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  MessageSquare,
  Code,
  Brain,
} from "lucide-react";

interface InterviewQuestion {
  id?: string;
  questionType: "mcq" | "coding" | "behavioral" | "system_design";
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
  timeLimit?: number;
  order: number;
}

interface InterviewTemplate {
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  companies: string[];
  questions: InterviewQuestion[];
}

export default function AddInterviewTemplatePage() {
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<InterviewTemplate>({
    name: "",
    description: "",
    duration: 45,
    difficulty: "easy",
    category: "web-development",
    companies: [],
    questions: [],
  });

  const difficulties = ["easy", "medium", "hard"];
    const categories = [
    // Entry-Level Technical Categories
    "web-development",
    "frontend-basics",
    "backend-basics",
    "database-fundamentals",
    "api-development",
    "version-control",
    "testing-basics",
    "deployment-basics",
    // Entry-Level Non-Technical Categories
    "communication-skills",
    "teamwork",
    "problem-solving",
    "time-management",
    "learning-ability",
    "adaptability",
    "customer-service",
    "basic-project-management",
  ];
  const questionTypes = [
    { value: "mcq", label: "Multiple Choice", icon: CheckCircle },
    { value: "coding", label: "Basic Coding", icon: Code },
    { value: "behavioral", label: "Behavioral", icon: MessageSquare },
    { value: "practical", label: "Practical Task", icon: Brain },
  ];

  const popularCompanies = [
    // Entry-Level & Startup Companies
    "StartupXYZ",
    "LocalTech",
    "DigitalAgency",
    "WebSolutions",
    "AppStudio",
    "CodeCraft",
    "TechStart",
    "InnovateLab",
    "DevWorks",
    "ByteBuild",
    "PixelPerfect",
    "CloudFirst",
    "DataFlow",
    "SmartSystems",
    "FutureTech",
    // Mid-Level Companies
    "Infosys",
    "TCS",
    "Wipro",
    "Cognizant",
    "Accenture",
    "Capgemini",
    "Tech Mahindra",
    "HCL",
    "L&T Infotech",
    "Mindtree",
    "Mphasis",
    "Persistent",
    "Zensar",
    "Hexaware",
    // Growing Companies
    "Razorpay",
    "CRED",
    "PhonePe",
    "Swiggy",
    "Zomato",
    "Ola",
    "Byju's",
    "Unacademy",
    "Cars24",
    "PolicyBazaar",
    "Nykaa",
    "Mamaearth",
    "Boat",
    "Wakefit",
    "Milkbasket",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/interviews/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      const result = await response.json();

      if (result.success) {
        alert("Interview template created successfully!");
        window.location.href = "/admin/interviews";
      } else {
        alert(result.error || "Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    const newQuestion: InterviewQuestion = {
      questionType: "mcq",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 8,
      timeLimit: 150,
      order: template.questions.length,
    };
    setTemplate((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    index: number,
    field: keyof InterviewQuestion,
    value: any
  ) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const removeQuestion = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const addOption = (questionIndex: number) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex ? { ...q, options: [...(q.options || []), ""] } : q
      ),
    }));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options?.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setTemplate((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options?.filter((_, j) => j !== optionIndex),
            }
          : q
      ),
    }));
  };

  const toggleCompany = (company: string) => {
    setTemplate((prev) => ({
      ...prev,
      companies: prev.companies.includes(company)
        ? prev.companies.filter((c) => c !== company)
        : [...prev.companies, company],
    }));
  };

  const getQuestionTypeIcon = (type: string) => {
    const questionType = questionTypes.find((qt) => qt.value === type);
    return questionType?.icon || FileText;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-800";
      case "coding":
        return "bg-green-100 text-green-800";
      case "behavioral":
        return "bg-purple-100 text-purple-800";
      case "practical":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <Target className="w-8 h-8 mr-3" />
                Create Interview Template
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/interviews")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to Interviews
              </Button>
            </div>
            <p className="text-purple-100 text-lg">
              Design entry-level interview templates for fresh graduates - 
              Start with basics, build confidence, grow skills
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Details */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Template Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={template.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Frontend Developer Interview"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={template.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <optgroup label="Entry-Level Technical">
                    <option value="web-development">Web Development Basics</option>
                    <option value="frontend-basics">Frontend Fundamentals</option>
                    <option value="backend-basics">Backend Fundamentals</option>
                    <option value="database-fundamentals">Database Basics</option>
                    <option value="api-development">API Development</option>
                    <option value="version-control">Version Control (Git)</option>
                    <option value="testing-basics">Testing Fundamentals</option>
                    <option value="deployment-basics">Deployment Basics</option>
                  </optgroup>
                  <optgroup label="Entry-Level Soft Skills">
                    <option value="communication-skills">Communication Skills</option>
                    <option value="teamwork">Teamwork & Collaboration</option>
                    <option value="problem-solving">Problem Solving</option>
                    <option value="time-management">Time Management</option>
                    <option value="learning-ability">Learning Ability</option>
                    <option value="adaptability">Adaptability</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="basic-project-management">Basic Project Management</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  name="difficulty"
                  value={template.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={template.duration}
                  onChange={handleInputChange}
                  min="15"
                  max="180"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={template.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder="Describe the interview template, target audience, and what it covers..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Target Companies */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Target Companies
            </h2>
            <p className="text-gray-600 mb-4">
              Select companies this template is designed for (optional)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {popularCompanies.map((company) => (
                <label
                  key={company}
                  className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={template.companies.includes(company)}
                    onChange={() => toggleCompany(company)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">{company}</span>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Questions */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Interview Questions ({template.questions.length})
              </h2>
              <Button
                type="button"
                onClick={addQuestion}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            {template.questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No questions added yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by adding questions to your interview template
                </p>
                <Button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {template.questions.map((question, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <select
                          value={question.questionType}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              "questionType",
                              e.target.value
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                        >
                          {questionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQuestionTypeColor(
                            question.questionType
                          )}`}
                        >
                          {
                            questionTypes.find(
                              (t) => t.value === question.questionType
                            )?.label
                          }
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question *
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(index, "question", e.target.value)
                          }
                          rows={3}
                          required
                          placeholder="Enter the question..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      {question.questionType === "mcq" && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Options *
                            </label>
                            <Button
                              type="button"
                              onClick={() => addOption(index)}
                              variant="outline"
                              size="sm"
                              disabled={(question.options?.length || 0) >= 6}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Option
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {question.options?.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  name={`correct-${index}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() =>
                                    updateQuestion(
                                      index,
                                      "correctAnswer",
                                      option
                                    )
                                  }
                                  className="w-4 h-4 text-purple-600"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Option ${optionIndex + 1}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                {(question.options?.length || 0) > 2 && (
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      removeOption(index, optionIndex)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) =>
                              updateQuestion(
                                index,
                                "points",
                                parseInt(e.target.value)
                              )
                            }
                            min="1"
                            max="50"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Limit (seconds)
                          </label>
                          <input
                            type="number"
                            value={question.timeLimit || ""}
                            onChange={(e) =>
                              updateQuestion(
                                index,
                                "timeLimit",
                                parseInt(e.target.value) || null
                              )
                            }
                            min="30"
                            max="600"
                            placeholder="No limit"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Order
                          </label>
                          <input
                            type="number"
                            value={question.order}
                            onChange={(e) =>
                              updateQuestion(
                                index,
                                "order",
                                parseInt(e.target.value)
                              )
                            }
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explanation (optional)
                        </label>
                        <textarea
                          value={question.explanation || ""}
                          onChange={(e) =>
                            updateQuestion(index, "explanation", e.target.value)
                          }
                          rows={2}
                          placeholder="Provide explanation for the correct answer..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Guidance */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Interview Template Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">🎯 Entry-Level Structure:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Start with basic concepts to build confidence</li>
                  <li>Focus on fundamental skills and learning ability</li>
                  <li>Include 8-12 questions for manageable duration</li>
                  <li>Mix technical basics with soft skills</li>
                  <li>Emphasize problem-solving and adaptability</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">⏱️ Entry-Level Timing:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>MCQ: 90-180 seconds per question</li>
                  <li>Basic Coding: 300-600 seconds per question</li>
                  <li>Behavioral: 120-240 seconds per question</li>
                  <li>Practical Tasks: 180-300 seconds per question</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = "/admin/interviews")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || template.questions.length === 0}
            className="flex items-center"
          >
            {loading ? (
              <Loading size="sm" text="Creating..." />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Template
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
