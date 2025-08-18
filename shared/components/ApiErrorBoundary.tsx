"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
  retryCount?: number;
  retryDelay?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryAttempts: number;
  isRetrying: boolean;
}

export class ApiErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryAttempts: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ApiErrorBoundary caught an error:", error);
      console.error("Error info:", errorInfo);
    }

    // Check if this is a network-related error
    const isNetworkError = this.isNetworkError(error);

    if (
      isNetworkError &&
      this.state.retryAttempts < (this.props.retryCount || 3)
    ) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private isNetworkError = (error: Error): boolean => {
    const networkErrorMessages = [
      "network error",
      "fetch failed",
      "connection refused",
      "timeout",
      "network request failed",
      "failed to fetch",
      "network error occurred",
    ];

    const errorMessage = error.message.toLowerCase();
    return networkErrorMessages.some((msg) => errorMessage.includes(msg));
  };

  private scheduleRetry = () => {
    const delay = this.props.retryDelay || 2000; // Default 2 seconds

    this.setState({ isRetrying: true });

    this.retryTimeout = setTimeout(() => {
      this.setState((prevState) => ({
        retryAttempts: prevState.retryAttempts + 1,
        isRetrying: false,
        hasError: false,
        error: null,
      }));
    }, delay);
  };

  private handleRetry = () => {
    if (this.props.onRetry) {
      this.props.onRetry();
    }

    this.setState({
      hasError: false,
      error: null,
      retryAttempts: 0,
      isRetrying: false,
    });
  };

  private handleManualRetry = () => {
    this.setState((prevState) => ({
      retryAttempts: prevState.retryAttempts + 1,
      hasError: false,
      error: null,
      isRetrying: false,
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError =
        this.state.error && this.isNetworkError(this.state.error);
      const maxRetries = this.props.retryCount || 3;
      const canRetry = this.state.retryAttempts < maxRetries;

      return (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {isNetworkError ? (
                  <WifiOff className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-red-800">
                  {isNetworkError ? "Connection Error" : "API Error"}
                </h3>

                <p className="text-sm text-red-700 mt-1">
                  {isNetworkError
                    ? "Unable to connect to the server. Please check your internet connection."
                    : "An error occurred while processing your request."}
                </p>

                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-red-600">
                      Error Details
                    </summary>
                    <pre className="text-xs text-red-600 mt-1 bg-red-100 p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}

                <div className="mt-3 flex space-x-2">
                  {canRetry && (
                    <Button
                      onClick={this.handleManualRetry}
                      size="sm"
                      className="flex items-center"
                      disabled={this.state.isRetrying}
                    >
                      {this.state.isRetrying ? (
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      {this.state.isRetrying ? "Retrying..." : "Retry"}
                    </Button>
                  )}

                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <Wifi className="w-3 h-3 mr-1" />
                    Try Again
                  </Button>
                </div>

                {isNetworkError && (
                  <p className="text-xs text-red-600 mt-2">
                    Retry attempt {this.state.retryAttempts + 1} of {maxRetries}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook for handling API errors in functional components
export function useApiErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleError = React.useCallback((error: Error) => {
    setError(error);

    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }
  }, []);

  const retry = React.useCallback(() => {
    setError(null);
    setIsRetrying(false);
  }, []);

  const scheduleRetry = React.useCallback((delay: number = 2000) => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      setError(null);
    }, delay);
  }, []);

  return {
    error,
    isRetrying,
    handleError,
    retry,
    scheduleRetry,
  };
}
