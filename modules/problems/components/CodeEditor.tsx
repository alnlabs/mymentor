import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onChange?: (code: string) => void; // Add for backward compatibility
  onRun: () => void;
  isRunning?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onCodeChange,
  onChange,
  onRun,
  isRunning = false,
  height = "400px",
}) => {
  const [editorHeight, setEditorHeight] = useState(400);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    onCodeChange(newCode);
    onChange?.(newCode); // Call onChange if provided
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Code Editor</h3>
        <div className="flex space-x-2">
          <select
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            value={language}
            onChange={(e) =>
              handleCodeChange(
                `// Language changed to ${e.target.value}\n${code}`
              )
            }
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <Button onClick={onRun} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Code"}
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Editor
          height={editorHeight}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </Card>
    </div>
  );
};
