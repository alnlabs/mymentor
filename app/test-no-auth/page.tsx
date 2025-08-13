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

export default function TestNoAuthPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log("🧪 NO AUTH: Starting fetch...");
        setLoading(true);
        setError(null);

        const response = await fetch("/api/exams?page=1&limit=10");
        console.log("🧪 NO AUTH: Response status:", response.status);

        const result = await response.json();
        console.log("🧪 NO AUTH: API Result:", result);

        if (result.success) {
          console.log("✅ NO AUTH: Setting exams:", result.data.length);
          setExams(result.data);
        } else {
          console.error("❌ NO AUTH: API Error:", result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error("❌ NO AUTH: Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        🧪 NO AUTH TEST PAGE
      </h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        This page has NO authentication, NO layout, NO context - just pure
        React.
      </p>

      {/* Status */}
      <div
        style={{
          backgroundColor: "#eff6ff",
          border: "1px solid #3b82f6",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#1e40af",
            marginBottom: "0.5rem",
          }}
        >
          Status:
        </h2>
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
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.25rem" }}>Loading exams...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#dc2626", fontWeight: "bold" }}>Error:</h3>
          <p style={{ color: "#dc2626" }}>{error}</p>
        </div>
      )}

      {!loading && !error && exams.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.25rem", color: "#666" }}>No exams found</p>
        </div>
      )}

      {!loading && !error && exams.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Exams List ({exams.length} found)
          </h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {exams.map((exam) => (
              <div
                key={exam.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#fff",
                }}
              >
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.125rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {exam.title}
                </h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  {exam.description}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    fontSize: "0.875rem",
                    color: "#666",
                  }}
                >
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
      <div
        style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #22c55e",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#166534",
            marginBottom: "0.5rem",
          }}
        >
          Manual Test:
        </h2>
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
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Manual API Test
        </button>
      </div>
    </div>
  );
}
