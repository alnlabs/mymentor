import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { DropdownType } from "@/shared/types/exam";
import {
  PROGRAMMING_LANGUAGES,
  REASONING_TYPES,
} from "@/shared/config/examConfig";

interface AutoFillSectionProps {
  dropdownType: DropdownType;
  selectedOption: string;
  lastUsedDropdown: string;
  onDropdownTypeChange: (type: DropdownType) => void;
  onSelectedOptionChange: (option: string) => void;
  onAutoPopulate: () => void;
}

export const AutoFillSection: React.FC<AutoFillSectionProps> = ({
  dropdownType,
  selectedOption,
  lastUsedDropdown,
  onDropdownTypeChange,
  onSelectedOptionChange,
  onAutoPopulate,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
          Quick Setup
        </h3>
        <p className="text-sm text-gray-600">
          Auto-fill the form with pre-configured exam templates for quick setup
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="programming"
                name="dropdownType"
                value="programming"
                checked={dropdownType === "programming"}
                onChange={(e) =>
                  onDropdownTypeChange(e.target.value as DropdownType)
                }
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <label
                htmlFor="programming"
                className="text-sm font-medium text-gray-700"
              >
                Programming
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="reasoning"
                name="dropdownType"
                value="reasoning"
                checked={dropdownType === "reasoning"}
                onChange={(e) =>
                  onDropdownTypeChange(e.target.value as DropdownType)
                }
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <label
                htmlFor="reasoning"
                className="text-sm font-medium text-gray-700"
              >
                Reasoning
              </label>
            </div>
          </div>

          <div className="flex-1">
            {dropdownType === "programming" && (
              <select
                value={selectedOption}
                onChange={(e) => onSelectedOptionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose programming language...</option>
                {Object.entries(PROGRAMMING_LANGUAGES).map(
                  ([category, languages]) => (
                    <optgroup key={category} label={category}>
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
              </select>
            )}

            {dropdownType === "reasoning" && (
              <select
                value={selectedOption}
                onChange={(e) => onSelectedOptionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose reasoning type...</option>
                {REASONING_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Button
            type="button"
            onClick={onAutoPopulate}
            disabled={!selectedOption}
            className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Auto-Populate
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-500 bg-white/50 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Quick Tips:</p>
        <ul className="space-y-1">
          <li>
            • <strong>Auto-Generation:</strong> Questions are automatically
            created based on your settings
          </li>
          <li>
            • <strong>Switch:</strong> Choose between Programming Languages or
            Reasoning Types
          </li>
          <li>
            • <strong>Select:</strong> Pick a specific language or reasoning
            type from the dropdown
          </li>
          <li>
            • <strong>Auto-Populate:</strong> Click the button to fill the form
            with your selection
          </li>
        </ul>
        {lastUsedDropdown && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 font-medium">
              ✅ Last used:{" "}
              {lastUsedDropdown === "language"
                ? "Programming Language"
                : "Reasoning Type"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
