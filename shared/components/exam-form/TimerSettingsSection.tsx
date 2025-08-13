import React from "react";
import { Clock } from "lucide-react";
import { ExamFormData } from "@/shared/types/exam";
import { EXAM_CONSTANTS } from "@/shared/config/examConfig";
import { useDynamicConfig } from "@/shared/config/dynamicConfig";

interface TimerSettingsSectionProps {
  formData: ExamFormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

export const TimerSettingsSection: React.FC<TimerSettingsSectionProps> = ({
  formData,
  onInputChange,
}) => {
  const config = useDynamicConfig();
  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-purple-600" />
        Timer Settings
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="enableOverallTimer"
            checked={formData.enableOverallTimer}
            onChange={onInputChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Enable Overall Exam Timer
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="enableTimedQuestions"
            checked={formData.enableTimedQuestions}
            onChange={onInputChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Enable Individual Question Timers
          </label>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={onInputChange}
            required
            min={config.exam.minDuration}
            max={config.exam.maxDuration}
            disabled={!formData.enableOverallTimer}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total exam duration ({config.exam.minDuration}-
            {config.exam.maxDuration} minutes)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Question Time (seconds)
          </label>
          <input
            type="number"
            name="defaultQuestionTime"
            value={formData.defaultQuestionTime}
            onChange={onInputChange}
            min={config.question.minTime}
            max={config.question.maxTime}
            disabled={!formData.enableTimedQuestions}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Default time limit per question ({config.question.minTime}-{config.question.maxTime} seconds)
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h5 className="text-sm font-medium text-blue-900">
              Timer Configuration
            </h5>
            <div className="mt-1 text-sm text-blue-700 space-y-1">
              <p>
                • <strong>Overall Timer:</strong>{" "}
                {formData.enableOverallTimer ? "Enabled" : "Disabled"} -{" "}
                {formData.duration} minutes total
              </p>
              <p>
                • <strong>Question Timers:</strong>{" "}
                {formData.enableTimedQuestions ? "Enabled" : "Disabled"} -{" "}
                {formData.defaultQuestionTime} seconds per question
              </p>
              {!formData.enableOverallTimer &&
                !formData.enableTimedQuestions && (
                  <p className="text-orange-700 font-medium">
                    ⚠️ No timers enabled - students can take unlimited time
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
