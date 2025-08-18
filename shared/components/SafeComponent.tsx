"use client";

import React, { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { ApiErrorBoundary } from "./ApiErrorBoundary";

interface SafeComponentProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
  enableApiErrorHandling?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * SafeComponent - A wrapper that automatically applies error boundaries
 * to prevent crashes and provide graceful error handling
 */
export function SafeComponent({
  children,
  componentName,
  fallback,
  enableApiErrorHandling = true,
  retryCount = 3,
  retryDelay = 2000,
}: SafeComponentProps) {
  const content = enableApiErrorHandling ? (
    <ApiErrorBoundary retryCount={retryCount} retryDelay={retryDelay}>
      {children}
    </ApiErrorBoundary>
  ) : (
    children
  );

  return (
    <ErrorBoundary componentName={componentName} fallback={fallback}>
      {content}
    </ErrorBoundary>
  );
}

/**
 * withErrorBoundary - Higher-order component for easy error boundary wrapping
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<SafeComponentProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <SafeComponent
      componentName={Component.displayName || Component.name}
      {...options}
    >
      <Component {...props} />
    </SafeComponent>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

/**
 * useSafeCallback - Hook for wrapping callbacks with error handling
 */
export function useSafeCallback<T extends (...args: any[]) => any>(
  callback: T,
  errorHandler?: (error: Error) => void
): T {
  return React.useCallback(
    ((...args: Parameters<T>) => {
      try {
        return callback(...args);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        if (process.env.NODE_ENV === "development") {
          console.error("Error in safe callback:", errorObj);
        }

        if (errorHandler) {
          errorHandler(errorObj);
        }

        // Re-throw in development for debugging
        if (process.env.NODE_ENV === "development") {
          throw errorObj;
        }
      }
    }) as T,
    [callback, errorHandler]
  );
}

/**
 * useSafeEffect - Hook for wrapping useEffect with error handling
 */
export function useSafeEffect(
  effect: () => void | (() => void),
  dependencies?: React.DependencyList
) {
  React.useEffect(() => {
    try {
      return effect();
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      if (process.env.NODE_ENV === "development") {
        console.error("Error in safe effect:", errorObj);
      }

      // In production, we might want to report this error
      if (process.env.NODE_ENV === "production") {
        // Report to error tracking service
        console.error("Production error in effect:", errorObj);
      }
    }
  }, dependencies);
}

/**
 * useSafeState - Hook for wrapping useState with error handling
 */
export function useSafeState<T>(
  initialState: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(initialState);

  const safeSetState = React.useCallback<
    React.Dispatch<React.SetStateAction<T>>
  >((newState) => {
    try {
      setState(newState);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      if (process.env.NODE_ENV === "development") {
        console.error("Error in safe setState:", errorObj);
      }
    }
  }, []);

  return [state, safeSetState];
}
