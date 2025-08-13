"use client";

import React, { useState, useEffect } from "react";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  category: string;
  totalQuestions: number;
  enableTimedQuestions: boolean;
  enableOverallTimer: boolean;
  defaultQuestionTime: number;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestApiPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log("🧪 Test API: Starting fetch...");
        setLoading(true);
        setError(null);

        const response = await fetch("/api/exams?page=1&limit=10");
        console.log("🧪 Test API: Response status:", response.status);

        const result = await response.json();
        console.log("🧪 Test API: API Result:", result);

        if (result.success) {
          console.log("✅ Test API: Setting exams:", result.data.length);
          setExams(result.data);
        } else {
          console.error("❌ Test API: API Error:", result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error("❌ Test API: Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧪 API Test Page</h1>
      <p className="text-gray-600">
        This page bypasses all authentication to test the API directly.
      </p>

      {/* Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-bold text-blue-800 mb-2">Status:</h2>
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Error:</strong> {error || "None"}
        </p>
        <p>
          <strong>Exams Count:</strong> {exams.length}
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-lg">Loading exams...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-bold">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && exams.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No exams found</p>
        </div>
      )}

      {!loading && !error && exams.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Exams List ({exams.length} found)
          </h2>
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-bold text-lg">{exam.title}</h3>
                <p className="text-gray-600 mt-1">{exam.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p>
                      <strong>ID:</strong> {exam.id}
                    </p>
                    <p>
                      <strong>Duration:</strong> {exam.duration} min
                    </p>
                    <p>
                      <strong>Questions:</strong> {exam.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Difficulty:</strong> {exam.difficulty}
                    </p>
                    <p>
                      <strong>Category:</strong> {exam.category}
                    </p>
                    <p>
                      <strong>Active:</strong> {exam.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Test Button */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h2 className="text-lg font-bold text-green-800 mb-2">Manual Test:</h2>
        <button
          onClick={async () => {
            try {
              console.log("🧪 Manual API Test...");
              const response = await fetch("/api/exams?page=1&limit=5");
              const result = await response.json();
              console.log("🧪 Manual Test Result:", result);
              alert(
                `Manual Test: ${
                  result.success ? "Success" : "Failed"
                }\nExams: ${result.data?.length || 0}`
              );
            } catch (err) {
              console.error("🧪 Manual Test Error:", err);
              alert(`Manual Test Error: ${err}`);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Manual API Test
        </button>
      </div>
    </div>
  );
}
