"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { useAuthContext } from "@/shared/components/AuthContext";

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

export default function DebugPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    loading: authLoading,
    isAdmin,
    isSuperAdmin,
  } = useAuthContext();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log("🔍 Debug: Starting fetch...");
        setLoading(true);
        setError(null);

        const response = await fetch("/api/exams?page=1&limit=10");
        console.log("🔍 Debug: Response status:", response.status);

        const result = await response.json();
        console.log("🔍 Debug: API Result:", result);

        if (result.success) {
          console.log("✅ Debug: Setting exams:", result.data.length);
          setExams(result.data);
        } else {
          console.error("❌ Debug: API Error:", result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error("❌ Debug: Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Debug Page</h1>

      {/* Auth Debug Info */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">
            🔐 Auth Debug Info:
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Auth Loading:</strong> {authLoading ? "Yes" : "No"}
            </p>
            <p>
              <strong>User:</strong> {user ? user.email : "None"}
            </p>
            <p>
              <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
            </p>
            <p>
              <strong>Is SuperAdmin:</strong> {isSuperAdmin ? "Yes" : "No"}
            </p>
            <p>
              <strong>User Object:</strong>{" "}
              {JSON.stringify(
                user ? { email: user.email, uid: user.uid } : null
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* State Information */}
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">📊 State Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </p>
            <p>
              <strong>Error:</strong> {error || "None"}
            </p>
            <p>
              <strong>Exams Count:</strong> {exams.length}
            </p>
            <p>
              <strong>Exams Array:</strong>{" "}
              {JSON.stringify(exams.map((e) => ({ id: e.id, title: e.title })))}
            </p>
          </div>
        </div>
      </Card>

      {loading && (
        <Card>
          <div className="p-4 text-center">
            <p className="text-lg">Loading exams...</p>
          </div>
        </Card>
      )}

      {error && (
        <Card>
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="text-red-800 font-bold">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {!loading && !error && exams.length === 0 && (
        <Card>
          <div className="p-4 text-center">
            <p className="text-lg text-gray-600">No exams found</p>
          </div>
        </Card>
      )}

      {!loading && !error && exams.length > 0 && (
        <Card>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              Exams List ({exams.length} found)
            </h2>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div key={exam.id} className="border p-4 rounded">
                  <h3 className="font-bold">{exam.title}</h3>
                  <p className="text-gray-600">{exam.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>ID: {exam.id}</p>
                    <p>Duration: {exam.duration} min</p>
                    <p>Questions: {exam.totalQuestions}</p>
                    <p>Difficulty: {exam.difficulty}</p>
                    <p>Category: {exam.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Test API Button */}
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">🧪 Test API</h2>
          <button
            onClick={async () => {
              try {
                console.log("🧪 Testing API...");
                const response = await fetch("/api/exams?page=1&limit=5");
                const result = await response.json();
                console.log("🧪 API Test Result:", result);
                alert(
                  `API Test: ${result.success ? "Success" : "Failed"}\nExams: ${
                    result.data?.length || 0
                  }`
                );
              } catch (err) {
                console.error("🧪 API Test Error:", err);
                alert(`API Test Error: ${err}`);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test API Call
          </button>
        </div>
      </Card>
    </div>
  );
}
