"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface ContentTabProps {
  context: SettingsContextType;
}

export default function ContentTab({ context }: ContentTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6 w-full">
      {/* Content Management Toggle */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📝 Content Management Fields
          </h3>
          <button
            type="button"
            onClick={() => {
              const contentSection = document.getElementById(
                "contentManagementSection"
              );
              if (contentSection) {
                contentSection.classList.toggle("hidden");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
            Toggle Content Management
          </button>
        </div>

        {/* Content Management Section - Initially Hidden */}
        <div id="contentManagementSection" className="hidden">
          {/* Add New Item Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              ➕ Add New Item
            </h4>
            <div className="flex gap-6 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Field
                </label>
                <select
                  id="fieldSelector"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  onChange={(e) => {
                    const input = document.getElementById(
                      "newItemInput"
                    ) as HTMLInputElement;
                    const addBtn = document.getElementById(
                      "addItemBtn"
                    ) as HTMLButtonElement;
                    const placeholder =
                      e.target.options[
                        e.target.selectedIndex
                      ].getAttribute("data-placeholder");

                    if (e.target.value) {
                      input.disabled = false;
                      addBtn.disabled = false;
                      input.placeholder =
                        placeholder || "Enter new item...";
                    } else {
                      input.disabled = true;
                      addBtn.disabled = true;
                      input.placeholder = "Select a field first...";
                    }
                  }}
                >
                  <option value="">Select a field to add to...</option>
                  <option
                    value="content_programming_languages"
                    data-placeholder="e.g., Rust, Swift, Kotlin"
                  >
                    Programming Languages
                  </option>
                  <option
                    value="content_technology_stacks"
                    data-placeholder="e.g., Cloud, AI/ML, Blockchain"
                  >
                    Technology Stacks
                  </option>
                  <option
                    value="content_tools"
                    data-placeholder="e.g., Docker, Kubernetes, AWS"
                  >
                    Tools & Technologies
                  </option>
                  <option
                    value="content_subjects"
                    data-placeholder="e.g., Cybersecurity, Blockchain, IoT"
                  >
                    Subjects
                  </option>
                  <option
                    value="content_topics"
                    data-placeholder="e.g., Recursion, Bit Manipulation, Math"
                  >
                    Topics
                  </option>
                  <option
                    value="content_domains"
                    data-placeholder="e.g., Gaming, FinTech, Healthcare"
                  >
                    Domains
                  </option>
                  <option
                    value="content_categories"
                    data-placeholder="e.g., Frontend, Backend, Full Stack"
                  >
                    Categories
                  </option>
                  <option
                    value="content_skill_levels"
                    data-placeholder="e.g., Expert, Senior, Lead"
                  >
                    Skill Levels
                  </option>
                  <option
                    value="content_interview_types"
                    data-placeholder="e.g., Case Study, Group Discussion"
                  >
                    Interview Types
                  </option>
                  <option
                    value="content_target_roles"
                    data-placeholder="e.g., Data Engineer, QA Engineer"
                  >
                    Target Roles
                  </option>
                  <option
                    value="content_job_roles"
                    data-placeholder="e.g., Technical Lead, Architect"
                  >
                    Job Roles
                  </option>
                  <option
                    value="content_company_types"
                    data-placeholder="e.g., Startup, Enterprise, Government"
                  >
                    Company Types
                  </option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Item
                </label>
                <input
                  id="newItemInput"
                  type="text"
                  placeholder="Select a field first..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:text-gray-500"
                  disabled
                />
              </div>
              <button
                type="button"
                id="addItemBtn"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
                onClick={() => {
                  const selector = document.getElementById(
                    "fieldSelector"
                  ) as HTMLSelectElement;
                  const input = document.getElementById(
                    "newItemInput"
                  ) as HTMLInputElement;
                  const newValue = input.value.trim();

                  if (newValue && selector.value) {
                    // Find the corresponding list and add the item
                    const listId =
                      selector.value.replace("content_", "") + "List";
                    const list = document.getElementById(listId);
                    if (list) {
                      const item = document.createElement("div");
                      item.className =
                        "flex items-center justify-between p-2 bg-gray-50 rounded";
                      item.innerHTML = `
                         <span class="text-sm text-gray-900">${newValue}</span>
                         <button type="button" class="text-red-500 hover:text-red-700" onclick="this.parentElement.remove()">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                           </svg>
                         </button>
                       `;
                      list.appendChild(item);
                      input.value = "";
                    }
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* All Fields Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {/* Programming Languages */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💻</span>
                Programming Languages
              </h5>
              <div
                id="programminglanguagesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_programming_languages", "")
                  .split(",")
                  .filter(Boolean)
                  .map((lang, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {lang.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Technology Stacks */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔧</span>
                Technology Stacks
              </h5>
              <div
                id="technologystacksList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_technology_stacks", "")
                  .split(",")
                  .filter(Boolean)
                  .map((stack, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {stack.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tools & Technologies */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🛠️</span>
                Tools & Technologies
              </h5>
              <div
                id="toolsList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_tools", "")
                  .split(",")
                  .filter(Boolean)
                  .map((tool, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {tool.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                Subjects
              </h5>
              <div
                id="subjectsList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_subjects", "")
                  .split(",")
                  .filter(Boolean)
                  .map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {subject.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Topics */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Topics
              </h5>
              <div
                id="topicsList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_topics", "")
                  .split(",")
                  .filter(Boolean)
                  .map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {topic.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Domains */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🌐</span>
                Domains
              </h5>
              <div
                id="domainsList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_domains", "")
                  .split(",")
                  .filter(Boolean)
                  .map((domain, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {domain.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Categories */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏷️</span>
                Categories
              </h5>
              <div
                id="categoriesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_categories", "")
                  .split(",")
                  .filter(Boolean)
                  .map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {category.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Skill Levels */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Skill Levels
              </h5>
              <div
                id="skilllevelsList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_skill_levels", "")
                  .split(",")
                  .filter(Boolean)
                  .map((level, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {level.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Interview Types */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎤</span>
                Interview Types
              </h5>
              <div
                id="interviewtypesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_interview_types", "")
                  .split(",")
                  .filter(Boolean)
                  .map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {type.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Target Roles */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Target Roles
              </h5>
              <div
                id="targetrolesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_target_roles", "")
                  .split(",")
                  .filter(Boolean)
                  .map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {role.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Job Roles */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">👔</span>
                Job Roles
              </h5>
              <div
                id="jobrolesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_job_roles", "")
                  .split(",")
                  .filter(Boolean)
                  .map((role, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {role.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Company Types */}
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏢</span>
                Company Types
              </h5>
              <div
                id="companytypesList"
                className="space-y-2 max-h-48 overflow-y-auto"
              >
                {getSettingValue("content_company_types", "")
                  .split(",")
                  .filter(Boolean)
                  .map((type, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {type.trim()}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) =>
                          e.currentTarget.parentElement?.remove()
                        }
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
              onClick={async () => {
                // Collect all items from all lists and save
                const fieldMappings = {
                  programminglanguagesList:
                    "content_programming_languages",
                  technologystacksList: "content_technology_stacks",
                  toolsList: "content_tools",
                  subjectsList: "content_subjects",
                  topicsList: "content_topics",
                  domainsList: "content_domains",
                  categoriesList: "content_categories",
                  skilllevelsList: "content_skill_levels",
                  interviewtypesList: "content_interview_types",
                  targetrolesList: "content_target_roles",
                  jobrolesList: "content_job_roles",
                  companytypesList: "content_company_types",
                };

                const settings = [];
                for (const [listId, settingKey] of Object.entries(
                  fieldMappings
                )) {
                  const list = document.getElementById(listId);
                  if (list) {
                    const items = Array.from(list.children)
                      .map(
                        (item) =>
                          item.querySelector("span")?.textContent || ""
                      )
                      .filter(Boolean);
                    settings.push({
                      key: settingKey,
                      value: items.join(", "),
                      category: "content",
                    });
                  }
                }

                await updateSettings(settings);
              }}
            >
              💾 Save All Changes
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
