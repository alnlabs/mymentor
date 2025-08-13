"use client";

import React, { useState } from "react";
import { ApiDebugPanel } from "./ApiDebugPanel";
import { ApiDebugContainer, useApiDebug } from "./ApiDebugContainer";
import { Button } from "./Button";

export function ApiDebugExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Example 1: Simple API Debug Panel
  const [simpleRequest, setSimpleRequest] = useState<any>(null);
  const [simpleResponse, setSimpleResponse] = useState<any>(null);

  // Example 2: Using the hook for multiple API calls
  const { trackApiCall, updateApiCall } = useApiDebug();

  const handleSimpleApiCall = async () => {
    setLoading(true);
    setError(null);

    const requestData = {
      endpoint: "/api/example",
      method: "POST",
      body: { test: "data" },
    };
    setSimpleRequest(requestData);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responseData = {
        success: true,
        data: {
          message: "API call successful",
          timestamp: new Date().toISOString(),
        },
      };
      setSimpleResponse(responseData);
      setData(responseData.data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleMultipleApiCalls = async () => {
    // Track multiple API calls
    const call1Id = trackApiCall("/api/users", "GET");
    const call2Id = trackApiCall("/api/posts", "POST", { title: "Test Post" });

    // Simulate first API call
    setTimeout(() => {
      updateApiCall(call1Id, {
        loading: false,
        responseData: { users: [{ id: 1, name: "John" }] },
        success: true,
      });
    }, 800);

    // Simulate second API call
    setTimeout(() => {
      updateApiCall(call2Id, {
        loading: false,
        responseData: { post: { id: 1, title: "Test Post" } },
        success: true,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">API Debug Components Example</h1>

      {/* Example 1: Simple API Debug Panel */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Example 1: Simple API Debug Panel
        </h2>
        <Button onClick={handleSimpleApiCall} disabled={loading}>
          {loading ? "Loading..." : "Make API Call"}
        </Button>

        <ApiDebugPanel
          title="Simple API Call"
          endpoint="/api/example"
          method="POST"
          requestData={simpleRequest}
          responseData={simpleResponse}
          loading={loading}
          error={error}
        />
      </div>

      {/* Example 2: Multiple API Calls with Container */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Example 2: Multiple API Calls</h2>
        <Button onClick={handleMultipleApiCalls}>
          Make Multiple API Calls
        </Button>

        <ApiDebugContainer title="Multiple API Calls Debug" maxCalls={3} />
      </div>

      {/* Data Display */}
      {data && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            API Response Data:
          </h3>
          <pre className="text-sm text-green-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
