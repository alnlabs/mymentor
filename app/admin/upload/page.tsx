"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Upload,
  Download,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Database,
  Settings,
  RefreshCw,
  Code,
  BarChart3,
} from "lucide-react";

interface Problem {
  id?: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  testCases: string;
  solution?: string;
  hints?: string;
  tags?: string;
  companies?: string;
}

interface MCQ {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string;
  companies?: string;
}

type UploadMode = "form" | "json" | "bulk";
type ContentType = "problems" | "mcq";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<ContentType>("problems");
  const [uploadMode, setUploadMode] = useState<UploadMode>("form");
  const [jsonData, setJsonData] = useState("");
  const [result, setResult] = useState<any>(null);
  const [existingItems, setExistingItems] = useState<any[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Form states
  const [problems, setProblems] = useState<Problem[]>([
    {
      title: "",
      description: "",
      difficulty: "easy",
      category: "",
      testCases: "",
      solution: "",
      hints: "",
      tags: "",
      companies: "",
    },
  ]);

  const [mcqs, setMcqs] = useState<MCQ[]>([
    {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "",
      difficulty: "easy",
      tags: "",
      companies: "",
    },
  ]);

  // Templates
  const problemTemplate = `[
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "category": "arrays",
    "testCases": "[{\\"input\\": \\"[2,7,11,15], 9\\", \\"output\\": \\"[0,1]\\"}, {\\"input\\": \\"[3,2,4], 6\\", \\"output\\": \\"[1,2]\\"}]",
    "solution": "Use a hash map to store complements. For each number, check if its complement exists in the map.",
    "hints": "[\\"Try using a hash map\\", \\"Think about complement pairs\\"]",
    "tags": "[\\"arrays\\", \\"hash-table\\"]",
    "companies": "[\\"Google\\", \\"Amazon\\", \\"Microsoft\\"]"
  }
]`;

  const mcqTemplate = `[
  {
    "question": "What is the time complexity of binary search?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "correctAnswer": 1,
    "explanation": "Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.",
    "category": "algorithms",
    "difficulty": "easy",
    "tags": "[\\"binary-search\\", \\"complexity\\"]",
    "companies": "[\\"Google\\", \\"Amazon\\", \\"Microsoft\\"]"
  }
]`;

  // CSV Templates
  const problemCSVTemplate = `title,description,difficulty,category,testCases,solution,hints,tags,companies
"Two Sum","Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.","easy","arrays","[{\\"input\\": \\"[2,7,11,15], 9\\", \\"output\\": \\"[0,1]\\"}]","Use a hash map to store complements.","Try using a hash map","arrays,hash-table","Google,Amazon,Microsoft"`;

  const mcqCSVTemplate = `question,options,correctAnswer,explanation,category,difficulty,tags,companies
"What is the time complexity of binary search?","O(n);O(log n);O(n²);O(1)",1,"Binary search divides the search space in half with each iteration.","algorithms","easy","binary-search,complexity","Google,Amazon,Microsoft"`;

  useEffect(() => {
    fetchExistingItems();
  }, [uploadType]);

  const fetchExistingItems = async () => {
    setLoadingExisting(true);
    try {
      const response = await fetch(`/api/${uploadType}`);
      const data = await response.json();
      if (data.success) {
        setExistingItems(data.data.slice(0, 10)); // Show last 10 items
      }
    } catch (error) {
      console.error("Error fetching existing items:", error);
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleUpload = async () => {
    if (uploadMode === "form") {
      await handleFormUpload();
    } else if (uploadMode === "json") {
      await handleJSONUpload();
    } else if (uploadMode === "bulk") {
      await handleBulkUpload();
    }
  };

  const handleFormUpload = async () => {
    const data = uploadType === "problems" ? problems : mcqs;
    const validData = data.filter((item) =>
      uploadType === "problems"
        ? item.title && item.description
        : item.question && item.options.some((opt) => opt.trim())
    );

    if (validData.length === 0) {
      alert("Please fill in at least one valid item");
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
          type: uploadType,
          data: validData,
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        // Reset forms on success
        if (uploadType === "problems") {
          setProblems([
            {
              title: "",
              description: "",
              difficulty: "easy",
              category: "",
              testCases: "",
              solution: "",
              hints: "",
              tags: "",
              companies: "",
            },
          ]);
        } else {
          setMcqs([
            {
              question: "",
              options: ["", "", "", ""],
              correctAnswer: 0,
              explanation: "",
              category: "",
              difficulty: "easy",
              tags: "",
              companies: "",
            },
          ]);
        }
        fetchExistingItems();
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

  const handleJSONUpload = async () => {
    if (!jsonData.trim()) {
      alert("Please enter JSON data");
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
          type: uploadType,
          data: JSON.parse(jsonData),
        }),
      });

      const result = await response.json();
      setResult(result);

      if (result.success) {
        setJsonData("");
        fetchExistingItems();
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

  const handleBulkUpload = async () => {
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
        setFileInputKey(prev => prev + 1);
        fetchExistingItems();
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || "Bulk upload failed",
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
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return 'csv';
      case 'xlsx':
      case 'xls':
        return 'excel';
      case 'json':
        return 'json';
      default:
        return 'unknown';
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
        testCases: "",
        solution: "",
        hints: "",
        tags: "",
        companies: "",
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
    value: string
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
        difficulty: "easy",
        tags: "",
        companies: "",
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
    if (format === "json") {
      const template = uploadType === "problems" ? problemTemplate : mcqTemplate;
      const blob = new Blob([template], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${uploadType}-template.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Download actual CSV template file
      const a = document.createElement("a");
      a.href = `/templates/${uploadType}-template.csv`;
      a.download = `${uploadType}-template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const loadTemplate = () => {
    setJsonData(uploadType === "problems" ? problemTemplate : mcqTemplate);
  };

  const clearData = () => {
    setJsonData("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Content Management</h2>
        <p className="text-green-100">
          Upload, manage, and organize coding problems and MCQ questions with
          advanced CRUD operations.
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="problems"
                    checked={uploadType === "problems"}
                    onChange={(e) =>
                      setUploadType(e.target.value as ContentType)
                    }
                    className="mr-2"
                  />
                  <Code className="w-4 h-4 mr-1" />
                  Problems
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mcq"
                    checked={uploadType === "mcq"}
                    onChange={(e) =>
                      setUploadType(e.target.value as ContentType)
                    }
                    className="mr-2"
                  />
                  <FileText className="w-4 h-4 mr-1" />
                  MCQ Questions
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("json")}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate("csv")}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV Template
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchExistingItems}
              disabled={loadingExisting}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  loadingExisting ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Mode Selection */}
          <Card>
            <div className="flex space-x-4 mb-6">
              <Button
                variant={uploadMode === "form" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMode("form")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Form Input
              </Button>
              <Button
                variant={uploadMode === "json" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMode("json")}
              >
                <FileText className="w-4 h-4 mr-2" />
                JSON Upload
              </Button>
              <Button
                variant={uploadMode === "bulk" ? "default" : "outline"}
                size="sm"
                onClick={() => setUploadMode("bulk")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Bulk Upload
              </Button>
            </div>

            {/* Form Input Mode */}
            {uploadMode === "form" && (
              <div className="space-y-6">
                {uploadType === "problems" ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Coding Problems</h3>
                      <Button onClick={addProblem} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Problem
                      </Button>
                    </div>

                    {problems.map((problem, index) => (
                      <Card key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Problem {index + 1}</h4>
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
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Problem title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <input
                              type="text"
                              value={problem.category}
                              onChange={(e) =>
                                updateProblem(index, "category", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., arrays, strings, algorithms"
                            />
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
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
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
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="comma-separated tags"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
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
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Problem description"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Cases *
                          </label>
                          <textarea
                            value={problem.testCases}
                            onChange={(e) =>
                              updateProblem(index, "testCases", e.target.value)
                            }
                            rows={2}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder='[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]'
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Solution
                            </label>
                            <textarea
                              value={problem.solution}
                              onChange={(e) =>
                                updateProblem(index, "solution", e.target.value)
                              }
                              rows={2}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Solution approach"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hints
                            </label>
                            <textarea
                              value={problem.hints}
                              onChange={(e) =>
                                updateProblem(index, "hints", e.target.value)
                              }
                              rows={2}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Helpful hints"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Companies
                          </label>
                          <input
                            type="text"
                            value={problem.companies}
                            onChange={(e) =>
                              updateProblem(index, "companies", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="comma-separated companies"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">MCQ Questions</h3>
                      <Button onClick={addMCQ} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add MCQ
                      </Button>
                    </div>

                    {mcqs.map((mcq, index) => (
                      <Card key={index} className="mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">MCQ {index + 1}</h4>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category *
                            </label>
                            <input
                              type="text"
                              value={mcq.category}
                              onChange={(e) =>
                                updateMCQ(index, "category", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., algorithms, data-structures"
                            />
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
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question *
                          </label>
                          <textarea
                            value={mcq.question}
                            onChange={(e) =>
                              updateMCQ(index, "question", e.target.value)
                            }
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MCQ question"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Options *
                          </label>
                          {mcq.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={mcq.correctAnswer === optionIndex}
                                onChange={() =>
                                  updateMCQ(index, "correctAnswer", optionIndex)
                                }
                                className="mr-2"
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
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Explanation
                            </label>
                            <textarea
                              value={mcq.explanation}
                              onChange={(e) =>
                                updateMCQ(index, "explanation", e.target.value)
                              }
                              rows={2}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Explanation for the correct answer"
                            />
                          </div>

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
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="comma-separated tags"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Companies
                          </label>
                          <input
                            type="text"
                            value={mcq.companies}
                            onChange={(e) =>
                              updateMCQ(index, "companies", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="comma-separated companies"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* JSON Upload Mode */}
            {uploadMode === "json" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    JSON Data
                  </label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    rows={15}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste your JSON data here..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={loadTemplate} variant="outline">
                    Load Template
                  </Button>
                  <Button onClick={clearData} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Bulk Upload Mode */}
            {uploadMode === "bulk" && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bulk Upload {uploadType === "problems" ? "Problems" : "MCQs"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload CSV, Excel, or JSON files with multiple items at once.
                  </p>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
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
                          : "CSV, Excel, or JSON files up to 10MB"
                        }
                      </span>
                    </label>
                  </div>

                  {/* File Info */}
                  {selectedFile && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{selectedFile.name}</p>
                            <p className="text-sm text-blue-700">
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
                            setFileInputKey(prev => prev + 1);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Supported Formats */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Supported Formats:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FileText className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium">CSV</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Comma-separated values with headers
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FileSpreadsheet className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">Excel</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          .xlsx or .xls files with tabular data
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FileText className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-medium">JSON</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          JSON array with structured data
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Template Downloads */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Download Templates:</h4>
                    <div className="flex flex-wrap gap-3 justify-center">
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
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={
                uploading || 
                (uploadMode === "json" && !jsonData.trim()) ||
                (uploadMode === "bulk" && !selectedFile)
              }
              className="w-full"
            >
              {uploading ? (
                <Loading size="sm" text="Uploading..." />
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadMode === "bulk" 
                    ? `Upload ${selectedFile?.name || "File"}`
                    : `Upload ${uploadType === "problems" ? "Problems" : "MCQs"}`
                  }
                </>
              )}
            </Button>

            {/* Result Display */}
            {result && (
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
                      {result.data.errors.map(
                        (error: string, index: number) => (
                          <li key={index}>{error}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
                {result.data?.duplicates &&
                  result.data.duplicates.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Duplicates Found:</p>
                      <ul className="text-sm list-disc list-inside">
                        {result.data.duplicates.map(
                          (dup: string, index: number) => (
                            <li key={index}>{dup}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Items */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Recent {uploadType === "problems" ? "Problems" : "MCQs"}
            </h3>

            {loadingExisting ? (
              <div className="text-center py-4">
                <Loading size="sm" text="Loading..." />
              </div>
            ) : existingItems.length > 0 ? (
              <div className="space-y-3">
                {existingItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadType === "problems"
                            ? item.title
                            : item.question}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.category} • {item.difficulty}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          title="View"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No {uploadType} found
              </p>
            )}
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Total {uploadType}:
                </span>
                <span className="text-sm font-medium">
                  {existingItems.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Easy:</span>
                <span className="text-sm font-medium text-green-600">
                  {
                    existingItems.filter((item) => item.difficulty === "easy")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Medium:</span>
                <span className="text-sm font-medium text-yellow-600">
                  {
                    existingItems.filter((item) => item.difficulty === "medium")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hard:</span>
                <span className="text-sm font-medium text-red-600">
                  {
                    existingItems.filter((item) => item.difficulty === "hard")
                      .length
                  }
                </span>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Tips & Guidelines
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Use clear, descriptive titles for problems</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Provide comprehensive test cases</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Include detailed explanations for MCQs</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Tag content appropriately for better organization</span>
              </div>
              <div className="flex items-start">
                <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Use consistent difficulty levels</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
