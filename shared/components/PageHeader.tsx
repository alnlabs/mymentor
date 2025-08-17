import React from "react";
import { Button } from "./Button";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backUrl?: string;
  backText?: string;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  backUrl,
  backText = "Back",
}: PageHeaderProps) {
  if (!title && !subtitle && !actions && !backUrl) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {backUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = backUrl)}
              className="mr-4"
            >
              ← {backText}
            </Button>
          )}
          {title && (
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          )}
        </div>
        {actions && <div className="flex space-x-3">{actions}</div>}
      </div>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
}
