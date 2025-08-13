import React from "react";
import { Target } from "lucide-react";
import { ExamFormData } from "@/shared/types/exam";
import {
  EXAM_DIFFICULTIES,
  TARGET_ROLES,
  QUESTION_TYPES,
} from "@/shared/config/examConfig";

interface ExamConfigSectionProps {
  formData: ExamFormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export const ExamConfigSection: React.FC<ExamConfigSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Target className="w-6 h-6 mr-3 text-purple-600" />
        Exam Configuration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level *
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={onInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {EXAM_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Score (%) *
          </label>
          <input
            type="number"
            name="passingScore"
            value={formData.passingScore}
            onChange={onInputChange}
            required
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Role
          </label>
          <select
            name="targetRole"
            value={formData.targetRole}
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Target Role</option>
            {TARGET_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Types *
          </label>
          <select
            name="questionTypes"
            value={formData.questionTypes}
            onChange={onInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Questions *
          </label>
          <input
            type="number"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={onInputChange}
            min="5"
            max="100"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-green-600 mt-1">
            ✅ Questions will be auto-generated based on your settings
          </p>
        </div>
      </div>
    </div>
  );
};
