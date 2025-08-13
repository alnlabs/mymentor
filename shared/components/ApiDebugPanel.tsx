"use client";

import React, { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react";

interface ApiDebugPanelProps {
  title: string;
  endpoint?: string;
  method?: string;
  requestData?: any;
  responseData?: any;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function ApiDebugPanel({
  title,
  endpoint,
  method = "GET",
  requestData,
  responseData,
  loading = false,
  error = null,
  className = "",
}: ApiDebugPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState({
    request: false,
    response: false,
  });
  const [isCollapsed, setIsCollapsed] = useState(true);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatData = (data: any) => {
    if (!data) return "No data";
    if (typeof data === "string") return data;
    return JSON.stringify(data, null, 2);
  };

  const getStatusColor = () => {
    if (loading) return "text-blue-600";
    if (error) return "text-red-600";
    return "text-green-600";
  };

  const getStatusText = () => {
    if (loading) return "Loading...";
    if (error) return "Error";
    return "Success";
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm w-full ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            {endpoint && (
              <span className="text-xs text-gray-500">
                {method} {endpoint}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500"
              title={
                isCollapsed ? "Expand debug panel" : "Collapse debug panel"
              }
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-3 space-y-3">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-md text-xs">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Request Data */}
          {requestData && (
            <div className="border border-gray-200 rounded-md">
              <div
                className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-t-md flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpanded({ ...expanded, request: !expanded.request })
                }
              >
                <span className="font-medium text-gray-700">Request Data</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(formatData(requestData), "request");
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Copy request data"
                  >
                    {copied === "request" ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {expanded.request ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
              {expanded.request && (
                <div className="p-2 bg-gray-50 rounded-b-md">
                  <pre className="text-xs text-gray-800 overflow-auto max-h-32 w-full">
                    {formatData(requestData)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Response Data */}
          {responseData && (
            <div className="border border-gray-200 rounded-md">
              <div
                className="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-t-md flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpanded({ ...expanded, response: !expanded.response })
                }
              >
                <span className="font-medium text-gray-700">Response Data</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(formatData(responseData), "response");
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Copy response data"
                  >
                    {copied === "response" ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {expanded.response ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
              {expanded.response && (
                <div className="p-2 bg-gray-50 rounded-b-md">
                  <pre className="text-xs text-gray-800 overflow-auto max-h-32 w-full">
                    {formatData(responseData)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 text-xs">Loading...</span>
            </div>
          )}

          {/* No Data State */}
          {!requestData && !responseData && !loading && !error && (
            <div className="text-center py-2 text-gray-500 text-xs">
              No data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
