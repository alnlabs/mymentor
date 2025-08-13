"use client";

import React from "react";
import { useDynamicConfig } from "@/shared/config/dynamicConfig";

interface DynamicSelectProps {
  field: keyof ReturnType<typeof useDynamicConfig>["content"];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
  field,
  value,
  onChange,
  placeholder = "Select option",
  className = "w-full border border-gray-300 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500",
  required = false,
  disabled = false,
  label,
  showLabel = true,
}) => {
  const config = useDynamicConfig();
  const options = config.content[field] || [];

  return (
    <div>
      {showLabel && label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace(/-/g, " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

// Specialized components for common fields
export const SubjectSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="subjects" label="Subject" placeholder="Select Subject" {...props} />
);

export const TopicSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="topics" label="Topic" placeholder="Select Topic" {...props} />
);

export const ToolSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="tools" label="Tool/Technology" placeholder="Select Tool" {...props} />
);

export const TechnologyStackSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="technologyStacks" label="Technology Stack" placeholder="Select Stack" {...props} />
);

export const DomainSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="domains" label="Domain" placeholder="Select Domain" {...props} />
);

export const SkillLevelSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="skillLevels" label="Skill Level" placeholder="Select Skill Level" {...props} />
);

export const JobRoleSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="jobRoles" label="Job Role" placeholder="Select Job Role" {...props} />
);

export const CompanyTypeSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="companyTypes" label="Company Type" placeholder="Select Company Type" {...props} />
);

export const InterviewTypeSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="interviewTypes" label="Interview Type" placeholder="Select Interview Type" {...props} />
);

export const CategorySelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="categories" label="Category" placeholder="Select Category" {...props} />
);

export const TargetRoleSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="targetRoles" label="Target Role" placeholder="Select Target Role" {...props} />
);

export const ProgrammingLanguageSelect: React.FC<Omit<DynamicSelectProps, "field">> = (props) => (
  <DynamicSelect field="programmingLanguages" label="Programming Language" placeholder="Select Language" {...props} />
);
