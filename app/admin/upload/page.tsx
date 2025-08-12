"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Upload,
  Download,
  FileText,
  Plus,
  Trash2,
  X,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Code,
} from "lucide-react";

interface Problem {
  id?: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  subject: string;
  topic: string;
  tool: string;
  technologyStack: string;
  domain: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  jobRole: string;
  companyType: string;
  interviewType: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "archived";
}

interface MCQ {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  subject: string;
  topic: string;
  tool: string;
  technologyStack: string;
  domain: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  jobRole: string;
  companyType: string;
  interviewType: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string;
  companies?: string;
  priority: "high" | "medium" | "low";
  status: "draft" | "active" | "archived";
}

type ContentType = "problems" | "mcq";
type UploadMethod = "manual" | "bulk";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<ContentType>("problems");
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("manual");

  // Check URL parameters for pre-selecting content type
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      if (type === "mcq") {
        setUploadType("mcq");
      } else if (type === "problems") {
        setUploadType("problems");
      }
    }
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [problems, setProblems] = useState<Problem[]>([
    {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      subject: "",
      topic: "",
      tool: "",
      technologyStack: "",
      domain: "",
      skillLevel: "beginner",
      jobRole: "",
      companyType: "",
      interviewType: "",
      testCases: "",
      solution: "",
      hints: "",
      tags: "",
      companies: "",
      priority: "medium",
      status: "draft",
    },
  ]);

  const [mcqs, setMcqs] = useState<MCQ[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      subject: "",
      topic: "",
      tool: "",
      technologyStack: "",
      domain: "",
      skillLevel: "beginner",
      jobRole: "",
      companyType: "",
      interviewType: "",
      difficulty: "easy",
      tags: "",
      companies: "",
      priority: "medium",
      status: "draft",
    },
  ]);

  const handleUpload = async () => {
    if (uploadType === "problems") {
      const validData = problems.filter(
        (item) => item.title && item.description
      );
      await uploadProblems(validData);
    } else {
      const validData = mcqs.filter(
        (item) => item.question && item.options.some((opt) => opt.trim())
      );
      await uploadMCQs(validData);
    }
  };

  const uploadProblems = async (validData: Problem[]) => {
    if (validData.length === 0) {
      alert("Please fill in at least one valid problem");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "problems",
          data: validData,
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        setProblems([
          {
            title: "",
            description: "",
            difficulty: "easy",
            category: "",
            subject: "",
            topic: "",
            tool: "",
            technologyStack: "",
            domain: "",
            skillLevel: "beginner",
            jobRole: "",
            companyType: "",
            interviewType: "",
            testCases: "",
            solution: "",
            hints: "",
            tags: "",
            companies: "",
            priority: "medium",
            status: "draft",
          },
        ]);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadMCQs = async (validData: MCQ[]) => {
    if (validData.length === 0) {
      alert("Please fill in at least one valid MCQ");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mcq",
          data: validData,
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        setMcqs([
          {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
            category: "",
            subject: "",
            topic: "",
            tool: "",
            technologyStack: "",
            domain: "",
            skillLevel: "beginner",
            jobRole: "",
            companyType: "",
            interviewType: "",
            difficulty: "easy",
            tags: "",
            companies: "",
            priority: "medium",
            status: "draft",
          },
        ]);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const fileContent = await readFileContent(selectedFile);
      const fileType = getFileType(selectedFile.name);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: uploadType,
          fileContent,
          fileType,
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        setSelectedFile(null);
        setFileInputKey((prev) => prev + 1);
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "File upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "csv":
        return "csv";
      case "xlsx":
      case "xls":
        return "excel";
      case "json":
        return "json";
      default:
        return "unknown";
    }
  };

  const addProblem = () => {
    setProblems([
      ...problems,
      {
        title: "",
        description: "",
        difficulty: "easy",
        category: "",
        subject: "",
        topic: "",
        tool: "",
        technologyStack: "",
        domain: "",
        skillLevel: "beginner",
        jobRole: "",
        companyType: "",
        interviewType: "",
        testCases: "",
        solution: "",
        hints: "",
        tags: "",
        companies: "",
        priority: "medium",
        status: "draft",
      },
    ]);
  };

  const removeProblem = (index: number) => {
    if (problems.length > 1) {
      setProblems(problems.filter((_, i) => i !== index));
    }
  };

  const updateProblem = (
    index: number,
    field: keyof Problem,
    value: string | number
  ) => {
    const updated = [...problems];
    updated[index] = { ...updated[index], [field]: value };
    setProblems(updated);
  };

  const addMCQ = () => {
    setMcqs([
      ...mcqs,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        category: "",
        subject: "",
        topic: "",
        tool: "",
        technologyStack: "",
        domain: "",
        skillLevel: "beginner",
        jobRole: "",
        companyType: "",
        interviewType: "",
        difficulty: "easy",
        tags: "",
        companies: "",
        priority: "medium",
        status: "draft",
      },
    ]);
  };

  const removeMCQ = (index: number) => {
    if (mcqs.length > 1) {
      setMcqs(mcqs.filter((_, i) => i !== index));
    }
  };

  const updateMCQ = (index: number, field: keyof MCQ, value: any) => {
    const updated = [...mcqs];
    if (field === "options") {
      updated[index] = { ...updated[index], options: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setMcqs(updated);
  };

  const updateMCQOption = (
    mcqIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...mcqs];
    updated[mcqIndex].options[optionIndex] = value;
    setMcqs(updated);
  };

  const downloadTemplate = (format: "json" | "csv") => {
    const a = document.createElement("a");
    a.href = `/templates/${uploadType}-template.${format}`;
    a.download = `${uploadType}-template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold flex items-center">
                <Upload className="w-8 h-8 mr-3" />
                Content Upload Center
              </h2>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/admin/problems")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to Problems
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/admin/mcq")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  ← Back to MCQs
                </Button>
              </div>
            </div>
            <p className="text-blue-100 text-lg">
              Add coding problems and MCQ questions to your platform with
              comprehensive categorization.
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>Manual entry with smart forms</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>Bulk upload with templates</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>Comprehensive categorization</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">📚</div>
                <div className="text-sm opacity-90">Knowledge Base</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content Type Selection */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Select Content Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`relative cursor-pointer group transition-all duration-200 ${
                  uploadType === "problems"
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300 ring-offset-2"
                }`}
              >
                <input
                  type="radio"
                  value="problems"
                  checked={uploadType === "problems"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="sr-only"
                />
                <div
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    uploadType === "problems"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        uploadType === "problems"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {uploadType === "problems" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <Code
                      className={`w-6 h-6 mr-3 ${
                        uploadType === "problems"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-lg ${
                        uploadType === "problems"
                          ? "text-blue-900"
                          : "text-gray-700"
                      }`}
                    >
                      Coding Problems
                    </span>
                  </div>
                  <p
                    className={`text-sm ml-7 ${
                      uploadType === "problems"
                        ? "text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    Algorithm challenges, data structure problems, and coding
                    exercises
                  </p>
                </div>
              </label>

              <label
                className={`relative cursor-pointer group transition-all duration-200 ${
                  uploadType === "mcq"
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:ring-2 hover:ring-gray-300 ring-offset-2"
                }`}
              >
                <input
                  type="radio"
                  value="mcq"
                  checked={uploadType === "mcq"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="sr-only"
                />
                <div
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    uploadType === "mcq"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        uploadType === "mcq"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {uploadType === "mcq" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <FileText
                      className={`w-6 h-6 mr-3 ${
                        uploadType === "mcq" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-lg ${
                        uploadType === "mcq" ? "text-blue-900" : "text-gray-700"
                      }`}
                    >
                      MCQ Questions
                    </span>
                  </div>
                  <p
                    className={`text-sm ml-7 ${
                      uploadType === "mcq" ? "text-blue-700" : "text-gray-600"
                    }`}
                  >
                    Multiple choice questions for knowledge assessment
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="lg:ml-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Download className="w-5 h-5 mr-2 text-green-600" />
                Download Templates
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Get started with our pre-filled templates
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate("csv")}
                  className="w-full justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadTemplate("json")}
                  className="w-full justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Upload Method Tabs */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-t-xl border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-blue-600" />
            Upload Method
          </h3>
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setUploadMethod("manual")}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center ${
                uploadMethod === "manual"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual Entry
            </button>
            <button
              onClick={() => setUploadMethod("bulk")}
              className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center ${
                uploadMethod === "bulk"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Manual Entry Tab */}
          {uploadMethod === "manual" && (
            <div>
              <div className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Plus className="w-6 h-6 mr-3 text-green-600" />
                    Manual Entry
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Add content one by one using our comprehensive form with
                    smart categorization.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      ✓ Smart Forms
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      ✓ Auto-save
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      ✓ Validation
                    </span>
                  </div>
                </div>
              </div>

              {uploadType === "problems" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Code className="w-6 h-6 mr-3 text-blue-600" />
                      <h4 className="text-xl font-bold text-gray-900">
                        Coding Problems
                      </h4>
                      <span className="ml-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {problems.length}{" "}
                        {problems.length === 1 ? "problem" : "problems"}
                      </span>
                    </div>
                    <Button
                      onClick={addProblem}
                      size="lg"
                      className="shadow-md"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Problem
                    </Button>
                  </div>

                  {problems.map((problem, index) => (
                    <Card
                      key={index}
                      className="mb-6 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-xl border-b border-blue-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3">
                              {index + 1}
                            </div>
                            <h5 className="text-lg font-bold text-gray-900">
                              Problem {index + 1}
                            </h5>
                          </div>
                          {problems.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeProblem(index)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                          <h6 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-600" />
                            Basic Information
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title *
                              </label>
                              <input
                                type="text"
                                value={problem.title}
                                onChange={(e) =>
                                  updateProblem(index, "title", e.target.value)
                                }
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter problem title..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                              </label>
                              <select
                                value={problem.category}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "category",
                                    e.target.value
                                  )
                                }
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              >
                                <option value="">Select Category</option>
                                <option value="algorithms">Algorithms</option>
                                <option value="data-structures">
                                  Data Structures
                                </option>
                                <option value="arrays">Arrays</option>
                                <option value="strings">Strings</option>
                                <option value="linked-lists">
                                  Linked Lists
                                </option>
                                <option value="stacks-queues">
                                  Stacks & Queues
                                </option>
                                <option value="trees">Trees</option>
                                <option value="graphs">Graphs</option>
                                <option value="dynamic-programming">
                                  Dynamic Programming
                                </option>
                                <option value="greedy-algorithms">
                                  Greedy Algorithms
                                </option>
                                <option value="backtracking">
                                  Backtracking
                                </option>
                                <option value="binary-search">
                                  Binary Search
                                </option>
                                <option value="sorting">Sorting</option>
                                <option value="hashing">Hashing</option>
                                <option value="recursion">Recursion</option>
                                <option value="bit-manipulation">
                                  Bit Manipulation
                                </option>
                                <option value="math">Math</option>
                                <option value="design-patterns">
                                  Design Patterns
                                </option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="database-design">
                                  Database Design
                                </option>
                                <option value="api-design">API Design</option>
                                <option value="security">Security</option>
                                <option value="testing">Testing</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Primary Categorization */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3">
                            Primary Categorization
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject *
                              </label>
                              <select
                                value={problem.subject}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "subject",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Subject</option>
                                <option value="programming">Programming</option>
                                <option value="data-science">
                                  Data Science
                                </option>
                                <option value="web-development">
                                  Web Development
                                </option>
                                <option value="mobile-development">
                                  Mobile Development
                                </option>
                                <option value="devops">DevOps</option>
                                <option value="ai-ml">AI/ML</option>
                                <option value="database">Database</option>
                                <option value="cybersecurity">
                                  Cybersecurity
                                </option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topic *
                              </label>
                              <select
                                value={problem.topic}
                                onChange={(e) =>
                                  updateProblem(index, "topic", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Topic</option>
                                <option value="arrays">Arrays</option>
                                <option value="strings">Strings</option>
                                <option value="linked-lists">
                                  Linked Lists
                                </option>
                                <option value="stacks-queues">
                                  Stacks & Queues
                                </option>
                                <option value="trees">Trees</option>
                                <option value="graphs">Graphs</option>
                                <option value="dynamic-programming">
                                  Dynamic Programming
                                </option>
                                <option value="greedy-algorithms">
                                  Greedy Algorithms
                                </option>
                                <option value="backtracking">
                                  Backtracking
                                </option>
                                <option value="binary-search">
                                  Binary Search
                                </option>
                                <option value="sorting">Sorting</option>
                                <option value="hashing">Hashing</option>
                                <option value="recursion">Recursion</option>
                                <option value="bit-manipulation">
                                  Bit Manipulation
                                </option>
                                <option value="math">Math</option>
                                <option value="design-patterns">
                                  Design Patterns
                                </option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="database-design">
                                  Database Design
                                </option>
                                <option value="api-design">API Design</option>
                                <option value="security">Security</option>
                                <option value="testing">Testing</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tool/Technology *
                              </label>
                              <select
                                value={problem.tool}
                                onChange={(e) =>
                                  updateProblem(index, "tool", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Tool</option>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="react">React</option>
                                <option value="nodejs">Node.js</option>
                                <option value="sql">SQL</option>
                                <option value="mongodb">MongoDB</option>
                                <option value="docker">Docker</option>
                                <option value="kubernetes">Kubernetes</option>
                                <option value="aws">AWS</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Technology Stack
                              </label>
                              <select
                                value={problem.technologyStack}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "technologyStack",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Stack</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="full-stack">Full Stack</option>
                                <option value="mobile">Mobile</option>
                                <option value="data">Data</option>
                                <option value="devops">DevOps</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Domain
                              </label>
                              <select
                                value={problem.domain}
                                onChange={(e) =>
                                  updateProblem(index, "domain", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Domain</option>
                                <option value="web">Web</option>
                                <option value="mobile">Mobile</option>
                                <option value="ai-ml">AI/ML</option>
                                <option value="data">Data</option>
                                <option value="cloud">Cloud</option>
                                <option value="security">Security</option>
                                <option value="gaming">Gaming</option>
                                <option value="fintech">FinTech</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skill Level *
                              </label>
                              <select
                                value={problem.skillLevel}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "skillLevel",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                  Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Professional Context */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3">
                            Professional Context
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Role
                              </label>
                              <select
                                value={problem.jobRole}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "jobRole",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Job Role</option>
                                <option value="frontend-developer">
                                  Frontend Developer
                                </option>
                                <option value="backend-developer">
                                  Backend Developer
                                </option>
                                <option value="full-stack-developer">
                                  Full Stack Developer
                                </option>
                                <option value="data-scientist">
                                  Data Scientist
                                </option>
                                <option value="data-engineer">
                                  Data Engineer
                                </option>
                                <option value="devops-engineer">
                                  DevOps Engineer
                                </option>
                                <option value="mobile-developer">
                                  Mobile Developer
                                </option>
                                <option value="software-engineer">
                                  Software Engineer
                                </option>
                                <option value="system-architect">
                                  System Architect
                                </option>
                                <option value="qa-engineer">QA Engineer</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Type
                              </label>
                              <select
                                value={problem.companyType}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "companyType",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Company Type</option>
                                <option value="tech">Tech</option>
                                <option value="finance">Finance</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="consulting">Consulting</option>
                                <option value="startup">Startup</option>
                                <option value="enterprise">Enterprise</option>
                                <option value="government">Government</option>
                                <option value="education">Education</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Type
                              </label>
                              <select
                                value={problem.interviewType}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "interviewType",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Interview Type</option>
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="coding">Coding</option>
                                <option value="data-structures">
                                  Data Structures
                                </option>
                                <option value="algorithms">Algorithms</option>
                                <option value="database">Database</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty *
                              </label>
                              <select
                                value={problem.difficulty}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "difficulty",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                              </label>
                              <select
                                value={problem.priority}
                                onChange={(e) =>
                                  updateProblem(
                                    index,
                                    "priority",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={problem.description}
                            onChange={(e) =>
                              updateProblem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Problem description"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Test Cases *
                            </label>
                            <textarea
                              value={problem.testCases}
                              onChange={(e) =>
                                updateProblem(
                                  index,
                                  "testCases",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder='[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]'
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={problem.status}
                              onChange={(e) =>
                                updateProblem(
                                  index,
                                  "status",
                                  e.target.value as any
                                )
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Solution
                            </label>
                            <textarea
                              value={problem.solution}
                              onChange={(e) =>
                                updateProblem(index, "solution", e.target.value)
                              }
                              rows={3}
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Solution approach"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tags
                            </label>
                            <input
                              type="text"
                              value={problem.tags}
                              onChange={(e) =>
                                updateProblem(index, "tags", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="comma-separated tags"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Companies
                          </label>
                          <input
                            type="text"
                            value={problem.companies}
                            onChange={(e) =>
                              updateProblem(index, "companies", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="comma-separated companies"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">MCQ Questions</h4>
                    <Button onClick={addMCQ} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add MCQ
                    </Button>
                  </div>

                  {mcqs.map((mcq, index) => (
                    <Card key={index} className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">
                          MCQ {index + 1}
                        </h5>
                        {mcqs.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMCQ(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question *
                          </label>
                          <textarea
                            value={mcq.question}
                            onChange={(e) =>
                              updateMCQ(index, "question", e.target.value)
                            }
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MCQ question"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options *
                          </label>
                          {mcq.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-3 mb-2"
                            >
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={mcq.correctAnswer === optionIndex}
                                onChange={() =>
                                  updateMCQ(index, "correctAnswer", optionIndex)
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateMCQOption(
                                    index,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Primary Categorization */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3">
                            Primary Categorization
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject *
                              </label>
                              <select
                                value={mcq.subject}
                                onChange={(e) =>
                                  updateMCQ(index, "subject", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Subject</option>
                                <option value="programming">Programming</option>
                                <option value="data-science">
                                  Data Science
                                </option>
                                <option value="web-development">
                                  Web Development
                                </option>
                                <option value="mobile-development">
                                  Mobile Development
                                </option>
                                <option value="devops">DevOps</option>
                                <option value="ai-ml">AI/ML</option>
                                <option value="database">Database</option>
                                <option value="cybersecurity">
                                  Cybersecurity
                                </option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topic *
                              </label>
                              <select
                                value={mcq.topic}
                                onChange={(e) =>
                                  updateMCQ(index, "topic", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Topic</option>
                                <option value="arrays">Arrays</option>
                                <option value="strings">Strings</option>
                                <option value="linked-lists">
                                  Linked Lists
                                </option>
                                <option value="stacks-queues">
                                  Stacks & Queues
                                </option>
                                <option value="trees">Trees</option>
                                <option value="graphs">Graphs</option>
                                <option value="dynamic-programming">
                                  Dynamic Programming
                                </option>
                                <option value="greedy-algorithms">
                                  Greedy Algorithms
                                </option>
                                <option value="backtracking">
                                  Backtracking
                                </option>
                                <option value="binary-search">
                                  Binary Search
                                </option>
                                <option value="sorting">Sorting</option>
                                <option value="hashing">Hashing</option>
                                <option value="recursion">Recursion</option>
                                <option value="bit-manipulation">
                                  Bit Manipulation
                                </option>
                                <option value="math">Math</option>
                                <option value="design-patterns">
                                  Design Patterns
                                </option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="database-design">
                                  Database Design
                                </option>
                                <option value="api-design">API Design</option>
                                <option value="security">Security</option>
                                <option value="testing">Testing</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tool/Technology *
                              </label>
                              <select
                                value={mcq.tool}
                                onChange={(e) =>
                                  updateMCQ(index, "tool", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Tool</option>
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="react">React</option>
                                <option value="nodejs">Node.js</option>
                                <option value="sql">SQL</option>
                                <option value="mongodb">MongoDB</option>
                                <option value="docker">Docker</option>
                                <option value="kubernetes">Kubernetes</option>
                                <option value="aws">AWS</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Technology Stack
                              </label>
                              <select
                                value={mcq.technologyStack}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "technologyStack",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Stack</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="full-stack">Full Stack</option>
                                <option value="mobile">Mobile</option>
                                <option value="data">Data</option>
                                <option value="devops">DevOps</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Domain
                              </label>
                              <select
                                value={mcq.domain}
                                onChange={(e) =>
                                  updateMCQ(index, "domain", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Domain</option>
                                <option value="web">Web</option>
                                <option value="mobile">Mobile</option>
                                <option value="ai-ml">AI/ML</option>
                                <option value="data">Data</option>
                                <option value="cloud">Cloud</option>
                                <option value="security">Security</option>
                                <option value="gaming">Gaming</option>
                                <option value="fintech">FinTech</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skill Level *
                              </label>
                              <select
                                value={mcq.skillLevel}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "skillLevel",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">
                                  Intermediate
                                </option>
                                <option value="advanced">Advanced</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Professional Context */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-medium text-gray-900 mb-3">
                            Professional Context
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Role
                              </label>
                              <select
                                value={mcq.jobRole}
                                onChange={(e) =>
                                  updateMCQ(index, "jobRole", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Job Role</option>
                                <option value="frontend-developer">
                                  Frontend Developer
                                </option>
                                <option value="backend-developer">
                                  Backend Developer
                                </option>
                                <option value="full-stack-developer">
                                  Full Stack Developer
                                </option>
                                <option value="data-scientist">
                                  Data Scientist
                                </option>
                                <option value="data-engineer">
                                  Data Engineer
                                </option>
                                <option value="devops-engineer">
                                  DevOps Engineer
                                </option>
                                <option value="mobile-developer">
                                  Mobile Developer
                                </option>
                                <option value="software-engineer">
                                  Software Engineer
                                </option>
                                <option value="system-architect">
                                  System Architect
                                </option>
                                <option value="qa-engineer">QA Engineer</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Type
                              </label>
                              <select
                                value={mcq.companyType}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "companyType",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Company Type</option>
                                <option value="tech">Tech</option>
                                <option value="finance">Finance</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="ecommerce">E-commerce</option>
                                <option value="consulting">Consulting</option>
                                <option value="startup">Startup</option>
                                <option value="enterprise">Enterprise</option>
                                <option value="government">Government</option>
                                <option value="education">Education</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Type
                              </label>
                              <select
                                value={mcq.interviewType}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "interviewType",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Interview Type</option>
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="system-design">
                                  System Design
                                </option>
                                <option value="coding">Coding</option>
                                <option value="data-structures">
                                  Data Structures
                                </option>
                                <option value="algorithms">Algorithms</option>
                                <option value="database">Database</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty *
                              </label>
                              <select
                                value={mcq.difficulty}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "difficulty",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                              </label>
                              <select
                                value={mcq.priority}
                                onChange={(e) =>
                                  updateMCQ(
                                    index,
                                    "priority",
                                    e.target.value as any
                                  )
                                }
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <select
                              value={mcq.category}
                              onChange={(e) =>
                                updateMCQ(index, "category", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select Category</option>
                              <option value="algorithms">Algorithms</option>
                              <option value="data-structures">
                                Data Structures
                              </option>
                              <option value="arrays">Arrays</option>
                              <option value="strings">Strings</option>
                              <option value="linked-lists">Linked Lists</option>
                              <option value="stacks-queues">
                                Stacks & Queues
                              </option>
                              <option value="trees">Trees</option>
                              <option value="graphs">Graphs</option>
                              <option value="dynamic-programming">
                                Dynamic Programming
                              </option>
                              <option value="greedy-algorithms">
                                Greedy Algorithms
                              </option>
                              <option value="backtracking">Backtracking</option>
                              <option value="binary-search">
                                Binary Search
                              </option>
                              <option value="sorting">Sorting</option>
                              <option value="hashing">Hashing</option>
                              <option value="recursion">Recursion</option>
                              <option value="bit-manipulation">
                                Bit Manipulation
                              </option>
                              <option value="math">Math</option>
                              <option value="design-patterns">
                                Design Patterns
                              </option>
                              <option value="system-design">
                                System Design
                              </option>
                              <option value="database-design">
                                Database Design
                              </option>
                              <option value="api-design">API Design</option>
                              <option value="security">Security</option>
                              <option value="testing">Testing</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={mcq.status}
                              onChange={(e) =>
                                updateMCQ(
                                  index,
                                  "status",
                                  e.target.value as any
                                )
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="draft">Draft</option>
                              <option value="active">Active</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation
                          </label>
                          <textarea
                            value={mcq.explanation}
                            onChange={(e) =>
                              updateMCQ(index, "explanation", e.target.value)
                            }
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Explanation for the correct answer"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tags
                            </label>
                            <input
                              type="text"
                              value={mcq.tags}
                              onChange={(e) =>
                                updateMCQ(index, "tags", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="comma-separated tags"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Companies
                            </label>
                            <input
                              type="text"
                              value={mcq.companies}
                              onChange={(e) =>
                                updateMCQ(index, "companies", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="comma-separated companies"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {uploading ? (
                    <Loading size="sm" text="Uploading Content..." />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mr-3" />
                      Upload {uploadType === "problems" ? "Problems" : "MCQs"}
                    </>
                  )}
                </Button>
                <p className="text-center text-sm text-gray-600 mt-3">
                  Your content will be validated and added to the platform
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Bulk Upload Tab */}
          {uploadMethod === "bulk" && (
            <div>
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <FileSpreadsheet className="w-6 h-6 mr-3 text-purple-600" />
                    Bulk Upload
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Upload CSV, Excel, or JSON files with multiple items for
                    efficient content management.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      📁 Multiple Formats
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      ⚡ Fast Processing
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      ✅ Validation
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                <input
                  key={fileInputKey}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
                    <FileSpreadsheet className="w-10 h-10 text-purple-600" />
                  </div>
                  <span className="text-xl font-semibold text-gray-800 mb-3">
                    {selectedFile
                      ? selectedFile.name
                      : "Choose a file to upload"}
                  </span>
                  <span className="text-gray-600 text-center max-w-md">
                    {selectedFile
                      ? `File size: ${(selectedFile.size / 1024).toFixed(1)} KB`
                      : "Drag and drop your file here, or click to browse. Supports CSV, Excel, and JSON formats up to 10MB."}
                  </span>
                  {!selectedFile && (
                    <div className="mt-6 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        CSV Format
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Excel Format
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        JSON Format
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {selectedFile && (
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-green-700">
                          Type: {getFileType(selectedFile.name).toUpperCase()} •
                          Size: {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setFileInputKey((prev) => prev + 1);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleFileUpload}
                disabled={uploading || !selectedFile}
                className="w-full mt-6"
              >
                {uploading ? (
                  <Loading size="sm" text="Uploading..." />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Enhanced Result Display */}
      {result && (
        <Card className="border-2 border-gray-100 shadow-lg">
          <div
            className={`p-6 rounded-xl ${
              result.success
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  result.success ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {result.success ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`text-xl font-bold mb-2 ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success
                    ? "🎉 Upload Successful!"
                    : "❌ Upload Failed"}
                </h4>
                <p
                  className={`text-base mb-4 ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.message}
                </p>

                {result.data?.imported !== undefined && (
                  <div className="bg-white/50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-semibold text-gray-800">
                      ✅ Successfully imported:{" "}
                      <span className="text-green-600 font-bold">
                        {result.data.imported}
                      </span>{" "}
                      items
                    </p>
                  </div>
                )}

                {result.data?.skipped !== undefined && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-3 border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">
                      ⚠️ Skipped (Duplicates):{" "}
                      <span className="font-bold">{result.data.skipped}</span>{" "}
                      items
                    </p>
                  </div>
                )}

                {result.data?.errors && result.data.errors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg mb-3 border border-red-200">
                    <p className="text-sm font-semibold text-red-800 mb-2">
                      ❌ Errors Found:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {result.data.errors.map(
                        (error: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {error}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {result.data?.duplicates &&
                  result.data.duplicates.length > 0 && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-sm font-semibold text-orange-800 mb-2">
                        🔄 Duplicates Found:
                      </p>
                      <ul className="text-sm text-orange-700 space-y-1">
                        {result.data.duplicates.map(
                          (dup: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {dup}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
