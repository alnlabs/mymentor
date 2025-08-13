"use client";

import React from "react";
import { ApiDebugPanel } from "./ApiDebugPanel";
import { useApiDebug } from "../hooks/useApiDebug";
import { Trash2 } from "lucide-react";
import { Button } from "./Button";

interface ApiDebugContainerProps {
  title?: string;
  maxCalls?: number;
  className?: string;
}

export function ApiDebugContainer({
  title = "API Debug",
  maxCalls = 5,
  className = "",
}: ApiDebugContainerProps) {
  const { apiCalls, clearApiCalls } = useApiDebug();

  const displayCalls = apiCalls.slice(0, maxCalls);

  if (displayCalls.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Button
          onClick={clearApiCalls}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </Button>
      </div>

      {/* API Debug Panels */}
      <div className="space-y-3">
        {displayCalls.map((call) => (
          <ApiDebugPanel
            key={call.id}
            title={`${call.method} ${call.endpoint}`}
            endpoint={call.endpoint}
            method={call.method}
            requestData={call.requestData}
            responseData={call.responseData}
            loading={call.loading}
            error={call.error}
          />
        ))}
      </div>
    </div>
  );
}

// Export the hook for use in other components
export { useApiDebug } from "../hooks/useApiDebug";
