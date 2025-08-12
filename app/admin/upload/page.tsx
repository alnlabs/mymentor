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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Upload Content</h2>
        <p className="text-blue-100">
          Add coding problems and MCQ questions to your platform.
        </p>
      </div>

      {/* Content Type Selection */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What are you uploading?
            </h3>
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  value="problems"
                  checked={uploadType === "problems"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <Code className="w-5 h-5 mr-2" />
                <span className="font-medium">Coding Problems</span>
              </label>
              <label className="flex items-center text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  value="mcq"
                  checked={uploadType === "mcq"}
                  onChange={(e) => setUploadType(e.target.value as ContentType)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <FileText className="w-5 h-5 mr-2" />
                <span className="font-medium">MCQ Questions</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("csv")}
            >
              <Download className="w-4 h-4 mr-2" />
              CSV Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("json")}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON Template
            </Button>
          </div>
        </div>
      </Card>

      {/* Upload Method Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setUploadMethod("manual")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                uploadMethod === "manual"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Manual Entry
              </div>
            </button>
            <button
              onClick={() => setUploadMethod("bulk")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                uploadMethod === "bulk"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Bulk Upload
              </div>
            </button>
          </nav>
        </div>

        <div className="pt-6">
          {/* Manual Entry Tab */}
          {uploadMethod === "manual" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Manual Entry
                </h3>
                <p className="text-gray-600">
                  Add content one by one using the form below.
                </p>
              </div>

              {uploadType === "problems" ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Coding Problems
                    </h4>
                    <Button onClick={addProblem} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Problem
                    </Button>
                  </div>

                  {problems.map((problem, index) => (
                    <Card key={index} className="mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">
                          Problem {index + 1}
                        </h5>
                        {problems.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeProblem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title *
                            </label>
                            <input
                              type="text"
                              value={problem.title}
                              onChange={(e) =>
                                updateProblem(index, "title", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Problem title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <select
                              value={problem.category}
                              onChange={(e) =>
                                updateProblem(index, "category", e.target.value)
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

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6"
              >
                {uploading ? (
                  <Loading size="sm" text="Uploading..." />
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {uploadType === "problems" ? "Problems" : "MCQs"}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Bulk Upload Tab */}
          {uploadMethod === "bulk" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bulk Upload
                </h3>
                <p className="text-gray-600">
                  Upload CSV, Excel, or JSON files with multiple items.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-400 transition-colors">
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
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-700 mb-2">
                    {selectedFile ? selectedFile.name : "Choose a file"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedFile
                      ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB`
                      : "CSV, Excel, or JSON files up to 10MB"}
                  </span>
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

      {/* Result Display */}
      {result && (
        <Card>
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {result.success ? (
                <Check className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              )}
              <h4
                className={`font-semibold ${
                  result.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {result.success ? "Upload Successful" : "Upload Failed"}
              </h4>
            </div>
            <p className="text-sm mt-2">{result.message}</p>
            {result.data?.imported !== undefined && (
              <p className="text-sm">Imported: {result.data.imported}</p>
            )}
            {result.data?.skipped !== undefined && (
              <p className="text-sm">
                Skipped (Duplicates): {result.data.skipped}
              </p>
            )}
            {result.data?.errors && result.data.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Errors:</p>
                <ul className="text-sm list-disc list-inside">
                  {result.data.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.data?.duplicates && result.data.duplicates.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Duplicates Found:</p>
                <ul className="text-sm list-disc list-inside">
                  {result.data.duplicates.map((dup: string, index: number) => (
                    <li key={index}>{dup}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
