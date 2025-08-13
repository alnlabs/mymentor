"use client";

import React, { useState } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType, Category } from "../types";

interface UsersTabProps {
  context: SettingsContextType;
}

export default function UsersTab({ context }: UsersTabProps) {
  const { getSettingValue, updateSettings, setMessage, categories } = context;
  
  // Category form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "exam",
    description: "",
    color: "#3B82F6",
    icon: "",
    sortOrder: 0,
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Category created successfully!" });
        setNewCategory({
          name: "",
          type: "exam",
          description: "",
          color: "#3B82F6",
          icon: "",
          sortOrder: 0,
        });
        // Refresh the page to update categories
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create category",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create category" });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Category deleted successfully" });
        // Refresh the page to update categories
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to delete category",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete category" });
    }
  };

  return (
    <div className="space-y-6">
      {/* User Management Settings */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          👥 User Management Settings
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await updateSettings([
              {
                key: "allow_registration",
                value: formData.get("allow_registration") as string,
                category: "users",
              },
              {
                key: "require_email_verification",
                value: formData.get("require_email_verification") as string,
                category: "users",
              },
              {
                key: "default_user_role",
                value: formData.get("default_user_role") as string,
                category: "users",
              },
              {
                key: "max_users",
                value: formData.get("max_users") as string,
                category: "users",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allow Registration
              </label>
              <select
                name="allow_registration"
                defaultValue={getSettingValue("allow_registration", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Require Email Verification
              </label>
              <select
                name="require_email_verification"
                defaultValue={getSettingValue("require_email_verification", "true")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="true">Required</option>
                <option value="false">Optional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default User Role
              </label>
              <select
                name="default_user_role"
                defaultValue={getSettingValue("default_user_role", "user")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Users
              </label>
              <input
                type="number"
                name="max_users"
                defaultValue={getSettingValue("max_users", "1000")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
                max="10000"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save User Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* Category Management */}
      <Card>
        <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🏷️ Category Management
        </h3>
        
        {/* Create New Category */}
        <form onSubmit={handleCreateCategory} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={newCategory.type}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="exam">Exam</option>
                <option value="question">Question</option>
                <option value="interview">Interview</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, color: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-10"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              ➕ Create Category
            </Button>
          </div>
        </form>

        {/* Existing Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="text-xs text-gray-500">{category.type}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
