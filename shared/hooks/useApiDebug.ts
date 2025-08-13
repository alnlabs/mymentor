import { useState, useCallback } from "react";

interface ApiCall {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  requestData?: any;
  responseData?: any;
  loading: boolean;
  error?: string;
  success?: boolean;
}

export function useApiDebug() {
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  const trackApiCall = useCallback(
    (endpoint: string, method: string = "GET", requestData?: any) => {
      const id = `${endpoint}-${Date.now()}`;
      const newCall: ApiCall = {
        id,
        timestamp: new Date(),
        endpoint,
        method,
        requestData,
        loading: true,
      };

      setApiCalls((prev) => [newCall, ...prev.slice(0, 9)]); // Keep last 10 calls
      return id;
    },
    []
  );

  const updateApiCall = useCallback(
    (
      id: string,
      updates: Partial<
        Omit<ApiCall, "id" | "timestamp" | "endpoint" | "method">
      >
    ) => {
      setApiCalls((prev) =>
        prev.map((call) => (call.id === id ? { ...call, ...updates } : call))
      );
    },
    []
  );

  const clearApiCalls = useCallback(() => {
    setApiCalls([]);
  }, []);

  const getLatestCall = useCallback(() => {
    return apiCalls[0] || null;
  }, [apiCalls]);

  return {
    apiCalls,
    trackApiCall,
    updateApiCall,
    clearApiCalls,
    getLatestCall,
  };
}
