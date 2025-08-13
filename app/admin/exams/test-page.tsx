"use client";

import React, { useState, useEffect } from "react";

export default function TestPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        console.log("Fetching exams...");
        const response = await fetch("/api/exams?page=1&limit=10");
        const result = await response.json();
        console.log("API Response:", result);

        if (result.success) {
          setExams(result.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="mb-4">
        <p>Loading: {loading ? "Yes" : "No"}</p>
        <p>Exams Count: {exams.length}</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Exams:</h2>
          {exams.map((exam: any) => (
            <div key={exam.id} className="border p-4 mb-2">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
