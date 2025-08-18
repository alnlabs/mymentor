# Error Boundaries System

This document describes the comprehensive error boundary system implemented to prevent app crashes and provide graceful error handling.

## Overview

The error boundary system consists of multiple components that work together to catch and handle errors at different levels of the application:

1. **ErrorBoundary** - General error boundary for React component errors
2. **ApiErrorBoundary** - Specialized boundary for API-related errors with retry functionality
3. **SafeComponent** - Wrapper component for easy error boundary application
4. **Error Reporting API** - Backend endpoint for collecting error reports

## Components

### 1. ErrorBoundary

**Location**: `shared/components/ErrorBoundary.tsx`

**Purpose**: Catches JavaScript errors anywhere in the child component tree and displays a fallback UI.

**Features**:

- Catches React rendering errors
- Provides user-friendly error messages
- Shows detailed error information in development
- Generates unique error IDs for tracking
- Offers retry, go back, and go home options
- Integrates with error reporting system

**Usage**:

```tsx
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

<ErrorBoundary componentName="MyComponent">
  <MyComponent />
</ErrorBoundary>;
```

**Props**:

- `children`: React components to wrap
- `fallback`: Custom error UI (optional)
- `onError`: Custom error handler (optional)
- `resetOnPropsChange`: Reset error state when props change (optional)
- `componentName`: Name for error reporting (optional)

### 2. ApiErrorBoundary

**Location**: `shared/components/ApiErrorBoundary.tsx`

**Purpose**: Specialized error boundary for handling API-related errors with automatic retry functionality.

**Features**:

- Detects network-related errors
- Automatic retry with configurable attempts and delays
- Manual retry options
- Different UI for network vs other errors
- Retry attempt tracking

**Usage**:

```tsx
import { ApiErrorBoundary } from "@/shared/components/ApiErrorBoundary";

<ApiErrorBoundary retryCount={3} retryDelay={2000}>
  <ApiComponent />
</ApiErrorBoundary>;
```

**Props**:

- `children`: React components to wrap
- `onRetry`: Custom retry handler (optional)
- `fallback`: Custom error UI (optional)
- `retryCount`: Number of automatic retry attempts (default: 3)
- `retryDelay`: Delay between retries in milliseconds (default: 2000)

### 3. SafeComponent

**Location**: `shared/components/SafeComponent.tsx`

**Purpose**: Convenient wrapper that combines both error boundaries for maximum protection.

**Features**:

- Combines ErrorBoundary and ApiErrorBoundary
- Easy-to-use interface
- Configurable error handling options
- Higher-order component support

**Usage**:

```tsx
import { SafeComponent } from "@/shared/components/SafeComponent";

<SafeComponent componentName="MyComponent" enableApiErrorHandling={true}>
  <MyComponent />
</SafeComponent>;
```

**Props**:

- `children`: React components to wrap
- `componentName`: Name for error reporting (optional)
- `fallback`: Custom error UI (optional)
- `enableApiErrorHandling`: Enable API error handling (default: true)
- `retryCount`: Number of retry attempts (default: 3)
- `retryDelay`: Delay between retries (default: 2000)

### 4. Higher-Order Components

**withErrorBoundary**: Wraps any component with error boundaries

```tsx
import { withErrorBoundary } from "@/shared/components/SafeComponent";

const SafeMyComponent = withErrorBoundary(MyComponent, {
  componentName: "MyComponent",
  enableApiErrorHandling: true,
});
```

### 5. Custom Hooks

**useErrorHandler**: Hook for handling errors in functional components

```tsx
import { useErrorHandler } from "@/shared/components/ErrorBoundary";

const handleError = useErrorHandler();
```

**useApiErrorHandler**: Hook for API error handling

```tsx
import { useApiErrorHandler } from "@/shared/components/ApiErrorBoundary";

const { error, isRetrying, handleError, retry } = useApiErrorHandler();
```

**useSafeCallback**: Wraps callbacks with error handling

```tsx
import { useSafeCallback } from "@/shared/components/SafeComponent";

const safeCallback = useSafeCallback(myCallback, (error) => {
  console.error("Error in callback:", error);
});
```

**useSafeEffect**: Wraps useEffect with error handling

```tsx
import { useSafeEffect } from "@/shared/components/SafeComponent";

useSafeEffect(() => {
  // Your effect code
}, [dependencies]);
```

**useSafeState**: Wraps useState with error handling

```tsx
import { useSafeState } from "@/shared/components/SafeComponent";

const [state, setState] = useSafeState(initialState);
```

## Error Reporting

### API Endpoint

**Location**: `app/api/error-reporting/route.ts`

**Purpose**: Collects error reports from error boundaries for analysis and debugging.

**Features**:

- Receives error reports via POST requests
- Validates error data
- Logs errors in development
- Stores errors in production (configurable)
- Integrates with external error tracking services (Sentry, etc.)

**Error Report Structure**:

```typescript
interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  componentName: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}
```

## Implementation Status

### ✅ Implemented

1. **Root Layout**: Error boundary at the application root
2. **Admin Layout**: Error boundary for admin pages
3. **Student Dashboard**: Error boundary for student interface
4. **AIGenerator**: Error boundary for AI content generation
5. **Error Reporting API**: Backend endpoint for error collection

### 🔄 Partially Implemented

1. **Critical Components**: Some components still need error boundaries
2. **Error Tracking Integration**: Ready for Sentry/LogRocket integration

### 📋 To Do

1. **Add error boundaries to remaining critical components**:

   - Exam taking pages
   - Problem solving pages
   - Interview pages
   - Authentication components

2. **Integrate with external error tracking**:

   - Sentry integration
   - LogRocket integration
   - Custom error dashboard

3. **Add error analytics**:
   - Error frequency tracking
   - Component error rates
   - User impact analysis

## Best Practices

### 1. Component-Level Error Boundaries

Wrap critical components that could fail:

```tsx
<ErrorBoundary componentName="CriticalComponent">
  <CriticalComponent />
</ErrorBoundary>
```

### 2. API Error Handling

Use ApiErrorBoundary for components that make API calls:

```tsx
<ApiErrorBoundary retryCount={3} retryDelay={2000}>
  <ApiComponent />
</ApiErrorBoundary>
```

### 3. Custom Error UI

Provide custom fallback UI for better user experience:

```tsx
<ErrorBoundary componentName="MyComponent" fallback={<CustomErrorUI />}>
  <MyComponent />
</ErrorBoundary>
```

### 4. Error Logging

Use the error reporting system for production debugging:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error handling
    console.error("Custom error handling:", error);
  }}
>
  <MyComponent />
</ErrorBoundary>
```

## Error Boundary Hierarchy

```
RootLayout (ErrorBoundary)
├── AuthProvider
├── SettingsProvider
└── Page Content
    ├── AdminLayout (ErrorBoundary)
    │   └── Admin Pages
    ├── StudentDashboard (ErrorBoundary + ApiErrorBoundary)
    │   └── Dashboard Content
    └── AIGenerator (ErrorBoundary + ApiErrorBoundary)
        └── AI Content
```

## Configuration

### Environment Variables

```bash
# Error reporting configuration
NODE_ENV=production  # Affects error display and reporting
SENTRY_DSN=your_sentry_dsn  # For Sentry integration
```

### Error Boundary Settings

```typescript
// Default settings
const defaultSettings = {
  retryCount: 3,
  retryDelay: 2000,
  enableApiErrorHandling: true,
  showErrorDetails: process.env.NODE_ENV === "development",
};
```

## Monitoring and Analytics

### Error Metrics

- **Error Rate**: Percentage of users experiencing errors
- **Error Frequency**: How often specific errors occur
- **Component Error Rate**: Which components fail most often
- **User Impact**: How many users are affected by errors

### Error Categories

1. **React Rendering Errors**: Component rendering failures
2. **API Errors**: Network and server communication failures
3. **JavaScript Errors**: Runtime JavaScript errors
4. **State Management Errors**: Redux/Context errors

## Troubleshooting

### Common Issues

1. **Error boundaries not catching errors**:

   - Ensure error boundaries are placed correctly in component tree
   - Check that errors are thrown in render or lifecycle methods

2. **API errors not being caught**:

   - Verify ApiErrorBoundary is wrapping API components
   - Check network error detection logic

3. **Error reports not being sent**:
   - Verify API endpoint is accessible
   - Check network connectivity
   - Review error report validation

### Debug Mode

In development, error boundaries show detailed error information:

```tsx
// Development: Shows full error details
// Production: Shows user-friendly message with error ID
```

## Future Enhancements

1. **Real-time Error Monitoring**: Live error tracking dashboard
2. **Error Prediction**: ML-based error prediction
3. **Automatic Recovery**: Self-healing components
4. **Performance Impact**: Error boundary performance optimization
5. **User Feedback**: Error reporting with user context

## Security Considerations

1. **Error Information**: Don't expose sensitive data in error messages
2. **Error Reports**: Sanitize error data before storage
3. **Rate Limiting**: Prevent error report spam
4. **Access Control**: Restrict error report access to authorized users

## Performance Impact

- **Bundle Size**: Error boundaries add minimal bundle size
- **Runtime Performance**: Negligible impact on normal operation
- **Error Handling**: Minimal overhead when errors occur
- **Memory Usage**: Error boundaries clean up properly

## Testing

### Error Boundary Testing

```tsx
// Test error boundary behavior
test("ErrorBoundary catches errors", () => {
  const ThrowError = () => {
    throw new Error("Test error");
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText("Something went wrong")).toBeInTheDocument();
});
```

### API Error Testing

```tsx
// Test API error boundary
test("ApiErrorBoundary handles network errors", () => {
  // Mock network error
  // Test retry functionality
  // Verify error UI display
});
```

This error boundary system provides comprehensive protection against app crashes while maintaining a good user experience and enabling effective error monitoring and debugging.
