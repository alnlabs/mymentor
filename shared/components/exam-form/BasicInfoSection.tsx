import React from "react";
import { BookOpen } from "lucide-react";
import { ExamFormData } from "@/shared/types/exam";
import { EXAM_CATEGORIES } from "@/shared/config/examConfig";

interface BasicInfoSectionProps {
  formData: ExamFormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <BookOpen className="w-6 h-6 mr-3 text-blue-600" />
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            placeholder="e.g., JavaScript Fundamentals for Fresh Graduates"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {EXAM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            rows={3}
            placeholder="Describe the exam content, objectives, and what students will learn..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};
