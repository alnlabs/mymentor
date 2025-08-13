# API Debug Components

A set of reusable React components for debugging API requests and responses with copy functionality.

## Components

### 1. ApiDebugPanel

A single API debug panel that displays request and response data with copy functionality.

#### Props

```typescript
interface ApiDebugPanelProps {
  title: string; // Panel title
  endpoint?: string; // API endpoint
  method?: string; // HTTP method (default: "GET")
  requestData?: any; // Request data to display
  responseData?: any; // Response data to display
  loading?: boolean; // Loading state
  error?: string | null; // Error message
  className?: string; // Additional CSS classes
}
```

#### Usage

```tsx
import { ApiDebugPanel } from "@/shared/components/ApiDebugPanel";

function MyComponent() {
  const [requestData, setRequestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ApiDebugPanel
      title="My API Call"
      endpoint="/api/data"
      method="POST"
      requestData={requestData}
      responseData={responseData}
      loading={loading}
      error={error}
    />
  );
}
```

### 2. ApiDebugContainer

A container component that displays multiple API debug panels using the `useApiDebug` hook.

#### Props

```typescript
interface ApiDebugContainerProps {
  title?: string; // Container title (default: "API Debug")
  maxCalls?: number; // Maximum calls to display (default: 5)
  className?: string; // Additional CSS classes
}
```

#### Usage

```tsx
import {
  ApiDebugContainer,
  useApiDebug,
} from "@/shared/components/ApiDebugContainer";

function MyComponent() {
  const { trackApiCall, updateApiCall } = useApiDebug();

  const makeApiCall = async () => {
    const callId = trackApiCall("/api/users", "GET");

    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      updateApiCall(callId, {
        loading: false,
        responseData: data,
        success: true,
      });
    } catch (error) {
      updateApiCall(callId, {
        loading: false,
        error: error.message,
      });
    }
  };

  return (
    <div>
      <button onClick={makeApiCall}>Make API Call</button>
      <ApiDebugContainer title="My API Calls" maxCalls={3} />
    </div>
  );
}
```

### 3. useApiDebug Hook

A custom hook for tracking multiple API calls.

#### Methods

```typescript
const {
  apiCalls, // Array of tracked API calls
  trackApiCall, // Start tracking a new API call
  updateApiCall, // Update an existing API call
  clearApiCalls, // Clear all tracked calls
  getLatestCall, // Get the most recent API call
} = useApiDebug();
```

#### Usage

```tsx
import { useApiDebug } from "@/shared/components/ApiDebugContainer";

function MyComponent() {
  const { trackApiCall, updateApiCall, clearApiCalls } = useApiDebug();

  const handleApiCall = async () => {
    // Start tracking
    const callId = trackApiCall("/api/data", "POST", { key: "value" });

    try {
      const response = await fetch("/api/data", {
        method: "POST",
        body: JSON.stringify({ key: "value" }),
      });
      const data = await response.json();

      // Update with success
      updateApiCall(callId, {
        loading: false,
        responseData: data,
        success: true,
      });
    } catch (error) {
      // Update with error
      updateApiCall(callId, {
        loading: false,
        error: error.message,
      });
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>Make Call</button>
      <button onClick={clearApiCalls}>Clear All</button>
    </div>
  );
}
```

## Features

- **Copy to Clipboard**: Click the copy icon to copy request or response data
- **Expandable Sections**: Click to expand/collapse request and response data
- **Loading States**: Visual indication of API call progress
- **Error Handling**: Display error messages with proper styling
- **Multiple API Calls**: Track and display multiple concurrent API calls
- **Responsive Design**: Works on all screen sizes
- **TypeScript Support**: Full TypeScript support with proper types

## Example Implementation

See `ApiDebugExample.tsx` for a complete example of how to use these components.

## Integration with Existing Code

To integrate with existing API calls, simply add the debug state and update your fetch functions:

```tsx
// Add debug state
const [apiRequest, setApiRequest] = useState(null);
const [apiResponse, setApiResponse] = useState(null);
const [apiError, setApiError] = useState(null);

// Update your fetch function
const fetchData = async () => {
  const requestData = { endpoint: "/api/data", method: "GET" };
  setApiRequest(requestData);

  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    setApiResponse(data);
  } catch (error) {
    setApiError(error.message);
  }
};

// Add the debug panel
<ApiDebugPanel
  title="Data API"
  requestData={apiRequest}
  responseData={apiResponse}
  error={apiError}
/>;
```
