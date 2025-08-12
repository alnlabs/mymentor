"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import {
  Upload,
  Download,
  FileText,
  Check,
  AlertCircle,
  FileSpreadsheet,
  ArrowLeft,
} from "lucide-react";

export default function MCQUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [result, setResult] = useState<any>(null);

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
          type: "mcq",
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

  const downloadTemplate = (format: "json" | "csv") => {
    const a = document.createElement("a");
    a.href = `/templates/mcq-template.${format}`;
    a.download = `mcq-template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold flex items-center">
                <Upload className="w-8 h-8 mr-3" />
                MCQ Bulk Upload
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/mcq")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ← Back to MCQs
              </Button>
            </div>
            <p className="text-purple-100 text-lg">
              Upload multiple MCQ questions at once using CSV, Excel, or JSON files.
            </p>
            <div className="flex items-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>CSV, Excel, JSON support</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>Template downloads</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-green-300" />
                <span>Validation & error handling</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">📝</div>
                <div className="text-sm opacity-90">MCQ Import</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Downloads */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <Download className="w-6 h-6 mr-3 text-green-600" />
            Download MCQ Templates
          </h3>
          <p className="text-gray-700 mb-4">
            Get started with our pre-filled MCQ templates that include all required fields and examples.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-green-600" />
                CSV Template
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Comma-separated values format with headers and example data.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate("csv")}
                className="w-full justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                JSON Template
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                JSON format with structured data and comprehensive fields.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate("json")}
                className="w-full justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON Template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Area */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-t-xl border-b border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
            <FileSpreadsheet className="w-6 h-6 mr-3 text-purple-600" />
            Upload MCQ Questions
          </h3>
          <p className="text-gray-700">
            Upload CSV, Excel, or JSON files with multiple MCQ questions for efficient content management.
          </p>
          <div className="flex flex-wrap gap-2 text-sm mt-3">
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

        <div className="p-6">
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
                  : "Drag and drop your MCQ file here, or click to browse. Supports CSV, Excel, and JSON formats up to 10MB."}
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
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleFileUpload}
            disabled={uploading || !selectedFile}
            className="w-full mt-6"
            size="lg"
          >
            {uploading ? (
              <Loading size="sm" text="Uploading MCQs..." />
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload MCQ Questions
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Result Display */}
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
                    ? "🎉 MCQ Upload Successful!"
                    : "❌ MCQ Upload Failed"}
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
                      MCQ questions
                    </p>
                  </div>
                )}

                {result.data?.skipped !== undefined && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-3 border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">
                      ⚠️ Skipped (Duplicates):{" "}
                      <span className="font-bold">{result.data.skipped}</span>{" "}
                      questions
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

                {result.success && (
                  <div className="mt-4 flex space-x-3">
                    <Button
                      onClick={() => window.location.href = "/admin/mcq"}
                      variant="outline"
                    >
                      View All MCQs
                    </Button>
                    <Button
                      onClick={() => window.location.href = "/admin/mcq/add"}
                      variant="outline"
                    >
                      Add Individual MCQ
                    </Button>
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
