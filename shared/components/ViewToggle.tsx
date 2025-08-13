import React from "react";
import { Table, List } from "lucide-react";
import { Button } from "./Button";

interface ViewToggleProps {
  view: "table" | "list";
  onViewChange: (view: "table" | "list") => void;
  className?: string;
}

export function ViewToggle({
  view,
  onViewChange,
  className = "",
}: ViewToggleProps) {
  return (
    <div
      className={`flex items-center border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      <Button
        onClick={() => onViewChange("table")}
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        className={`px-3 py-2 rounded-none border-0 ${
          view === "table"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "hover:bg-gray-100"
        }`}
        title="Table View"
      >
        <Table className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => onViewChange("list")}
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        className={`px-3 py-2 rounded-none border-0 ${
          view === "list"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "hover:bg-gray-100"
        }`}
        title="List View"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
