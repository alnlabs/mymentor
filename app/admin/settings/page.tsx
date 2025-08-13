"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { RouteGuard } from "@/shared/components/RouteGuard";

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

interface GlobalConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
}

type TabType =
  | "security"
  | "general"
  | "email"
  | "users"
  | "platform"
  | "categories"
  | "content"
  | "global"
  | "system";

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<TabType>("security");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [globalConfigs, setGlobalConfigs] = useState<GlobalConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Category form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "exam",
    description: "",
    color: "#3B82F6",
    icon: "",
    sortOrder: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [settingsRes, categoriesRes, globalConfigsRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/global-configs"),
      ]);

      const [settingsData, categoriesData, globalConfigsData] =
        await Promise.all([
          settingsRes.json(),
          categoriesRes.json(),
          globalConfigsRes.json(),
        ]);

      if (settingsData.success) setSettings(settingsData.data);
      if (categoriesData.success) setCategories(categoriesData.data);
      if (globalConfigsData.success) setGlobalConfigs(globalConfigsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSettingValue = (key: string, defaultValue: string = "") => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || defaultValue;
  };

  const updateSettings = async (newSettings: Partial<Setting>[]) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
        fetchAllData();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update settings",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await fetch("/api/admin/settings/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || "superadmin",
          newPassword: newPassword || currentPassword,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({
          type: "success",
          text: "SuperAdmin credentials updated successfully!",
        });
        setCurrentPassword("");
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update credentials",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update credentials" });
    }
  };

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
        fetchAllData();
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

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "security", label: "Security", icon: "🔐" },
    { id: "general", label: "General", icon: "⚙️" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "platform", label: "Platform", icon: "📊" },
    { id: "categories", label: "Categories", icon: "🏷️" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "global", label: "Global", icon: "🌍" },
    { id: "system", label: "System", icon: "🛠️" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-purple-100">
          Manage platform configuration, categories, and global settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SuperAdmin Credentials */}
            <Card>
              <h3 className="text-xl font-semibold mb-6">
                ⚡ SuperAdmin Credentials
              </h3>
              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter new username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Update SuperAdmin Credentials
                </Button>
              </form>
            </Card>

            {/* Password Policy */}
            <Card>
              <h3 className="text-xl font-semibold mb-6">🔒 Password Policy</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  await updateSettings([
                    {
                      key: "password_min_length",
                      value: formData.get("password_min_length") as string,
                      category: "security",
                    },
                    {
                      key: "password_require_special",
                      value: formData.get("password_require_special") as string,
                      category: "security",
                    },
                    {
                      key: "session_timeout",
                      value: formData.get("session_timeout") as string,
                      category: "security",
                    },
                  ]);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Password Length
                    </label>
                    <select
                      name="password_min_length"
                      defaultValue={getSettingValue("password_min_length", "8")}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="6">6 characters</option>
                      <option value="8">8 characters</option>
                      <option value="10">10 characters</option>
                      <option value="12">12 characters</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Require Special Characters
                    </label>
                    <select
                      name="password_require_special"
                      defaultValue={getSettingValue(
                        "password_require_special",
                        "false"
                      )}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      name="session_timeout"
                      defaultValue={getSettingValue("session_timeout", "30")}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loading size="sm" text="Updating..." />
                    ) : (
                      "Update Password Policy"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {activeTab === "general" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">⚙️ General Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "app_name",
                    value: formData.get("app_name") as string,
                    category: "general",
                  },
                  {
                    key: "contact_email",
                    value: formData.get("contact_email") as string,
                    category: "general",
                  },
                  {
                    key: "default_language",
                    value: formData.get("default_language") as string,
                    category: "general",
                  },
                  {
                    key: "default_timezone",
                    value: formData.get("default_timezone") as string,
                    category: "general",
                  },
                  {
                    key: "popular_companies",
                    value: formData.get("popular_companies") as string,
                    category: "general",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Name
                  </label>
                  <input
                    name="app_name"
                    type="text"
                    defaultValue={getSettingValue(
                      "app_name",
                      "Interview Platform"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    name="contact_email"
                    type="email"
                    defaultValue={getSettingValue(
                      "contact_email",
                      "admin@mymentorapp.com"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Language
                  </label>
                  <select
                    name="default_language"
                    defaultValue={getSettingValue("default_language", "en")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Timezone
                  </label>
                  <select
                    name="default_timezone"
                    defaultValue={getSettingValue("default_timezone", "UTC")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Popular Companies (comma-separated)
                  </label>
                  <textarea
                    name="popular_companies"
                    defaultValue={getSettingValue("popular_companies", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="LocalShop, SmallOffice, DigitalPrint, WebDesign..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    List of popular companies for interview templates
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update General Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Create Category */}
            <Card>
              <h3 className="text-xl font-semibold mb-6">
                🏷️ Create New Category
              </h3>
              <form
                onSubmit={handleCreateCategory}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
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
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter category name"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={newCategory.sortOrder}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        sortOrder: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Enter category description"
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">
                    Create Category
                  </Button>
                </div>
              </form>
            </Card>

            {/* Categories List */}
            <Card>
              <h3 className="text-xl font-semibold mb-6">📋 All Categories</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded mr-3"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">
                              {category.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              category.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Add other tabs here */}
        {activeTab === "email" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">📧 Email Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "smtp_server",
                    value: formData.get("smtp_server") as string,
                    category: "email",
                  },
                  {
                    key: "smtp_email",
                    value: formData.get("smtp_email") as string,
                    category: "email",
                  },
                  {
                    key: "smtp_password",
                    value: formData.get("smtp_password") as string,
                    category: "email",
                  },
                  {
                    key: "smtp_port",
                    value: formData.get("smtp_port") as string,
                    category: "email",
                  },
                  {
                    key: "welcome_email",
                    value: formData.get("welcome_email") as string,
                    category: "email",
                  },
                  {
                    key: "password_reset_email",
                    value: formData.get("password_reset_email") as string,
                    category: "email",
                  },
                  {
                    key: "exam_completion_email",
                    value: formData.get("exam_completion_email") as string,
                    category: "email",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Server
                  </label>
                  <select
                    name="smtp_server"
                    defaultValue={getSettingValue("smtp_server", "gmail")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="gmail">Gmail</option>
                    <option value="outlook">Outlook</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    name="smtp_email"
                    type="email"
                    defaultValue={getSettingValue("smtp_email", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="your-email@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password/API Key
                  </label>
                  <input
                    name="smtp_password"
                    type="password"
                    defaultValue={getSettingValue("smtp_password", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter password or API key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port
                  </label>
                  <select
                    name="smtp_port"
                    defaultValue={getSettingValue("smtp_port", "587")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="587">587 (TLS)</option>
                    <option value="465">465 (SSL)</option>
                    <option value="25">25 (Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Email
                  </label>
                  <select
                    name="welcome_email"
                    defaultValue={getSettingValue("welcome_email", "true")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password Reset Email
                  </label>
                  <select
                    name="password_reset_email"
                    defaultValue={getSettingValue(
                      "password_reset_email",
                      "true"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Completion Email
                  </label>
                  <select
                    name="exam_completion_email"
                    defaultValue={getSettingValue(
                      "exam_completion_email",
                      "true"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update Email Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "users" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">👥 User Management</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "allow_user_registration",
                    value: formData.get("allow_user_registration") as string,
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
                  {
                    key: "user_session_timeout",
                    value: formData.get("user_session_timeout") as string,
                    category: "users",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allow User Registration
                  </label>
                  <select
                    name="allow_user_registration"
                    defaultValue={getSettingValue(
                      "allow_user_registration",
                      "true"
                    )}
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
                    defaultValue={getSettingValue(
                      "require_email_verification",
                      "true"
                    )}
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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Users
                  </label>
                  <input
                    name="max_users"
                    type="number"
                    defaultValue={getSettingValue("max_users", "1000")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Session Timeout (minutes)
                  </label>
                  <select
                    name="user_session_timeout"
                    defaultValue={getSettingValue("user_session_timeout", "30")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update User Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "platform" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">📊 Platform Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "default_exam_duration",
                    value: formData.get("default_exam_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "allow_exam_retakes",
                    value: formData.get("allow_exam_retakes") as string,
                    category: "platform",
                  },
                  {
                    key: "show_results_immediately",
                    value: formData.get("show_results_immediately") as string,
                    category: "platform",
                  },
                  {
                    key: "default_interview_duration",
                    value: formData.get("default_interview_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "allow_interview_rescheduling",
                    value: formData.get(
                      "allow_interview_rescheduling"
                    ) as string,
                    category: "platform",
                  },
                  {
                    key: "max_questions_per_exam",
                    value: formData.get("max_questions_per_exam") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_min_duration",
                    value: formData.get("exam_min_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_max_duration",
                    value: formData.get("exam_max_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_min_questions",
                    value: formData.get("exam_min_questions") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_max_questions",
                    value: formData.get("exam_max_questions") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_default_question_time",
                    value: formData.get("exam_default_question_time") as string,
                    category: "platform",
                  },
                  {
                    key: "exam_default_passing_score",
                    value: formData.get("exam_default_passing_score") as string,
                    category: "platform",
                  },
                  {
                    key: "question_min_time",
                    value: formData.get("question_min_time") as string,
                    category: "platform",
                  },
                  {
                    key: "question_max_time",
                    value: formData.get("question_max_time") as string,
                    category: "platform",
                  },
                  {
                    key: "interview_min_duration",
                    value: formData.get("interview_min_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "interview_max_duration",
                    value: formData.get("interview_max_duration") as string,
                    category: "platform",
                  },
                  {
                    key: "ai_max_questions_per_request",
                    value: formData.get("ai_max_questions_per_request") as string,
                    category: "platform",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Exam Duration (minutes)
                  </label>
                  <select
                    name="default_exam_duration"
                    defaultValue={getSettingValue(
                      "default_exam_duration",
                      "60"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allow Exam Retakes
                  </label>
                  <select
                    name="allow_exam_retakes"
                    defaultValue={getSettingValue("allow_exam_retakes", "true")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Allowed</option>
                    <option value="false">Not Allowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Show Results Immediately
                  </label>
                  <select
                    name="show_results_immediately"
                    defaultValue={getSettingValue(
                      "show_results_immediately",
                      "true"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Interview Duration (minutes)
                  </label>
                  <select
                    name="default_interview_duration"
                    defaultValue={getSettingValue(
                      "default_interview_duration",
                      "45"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allow Interview Rescheduling
                  </label>
                  <select
                    name="allow_interview_rescheduling"
                    defaultValue={getSettingValue(
                      "allow_interview_rescheduling",
                      "true"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Allowed</option>
                    <option value="false">Not Allowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Questions Per Exam
                  </label>
                  <input
                    name="max_questions_per_exam"
                    type="number"
                    defaultValue={getSettingValue(
                      "max_questions_per_exam",
                      "50"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Min Duration (minutes)
                  </label>
                  <input
                    name="exam_min_duration"
                    type="number"
                    defaultValue={getSettingValue("exam_min_duration", "15")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="5"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Max Duration (minutes)
                  </label>
                  <input
                    name="exam_max_duration"
                    type="number"
                    defaultValue={getSettingValue("exam_max_duration", "300")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="60"
                    max="600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Min Questions
                  </label>
                  <input
                    name="exam_min_questions"
                    type="number"
                    defaultValue={getSettingValue("exam_min_questions", "5")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Max Questions
                  </label>
                  <input
                    name="exam_max_questions"
                    type="number"
                    defaultValue={getSettingValue("exam_max_questions", "100")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="20"
                    max="200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Question Time (seconds)
                  </label>
                  <input
                    name="exam_default_question_time"
                    type="number"
                    defaultValue={getSettingValue("exam_default_question_time", "120")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="30"
                    max="600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Passing Score (%)
                  </label>
                  <input
                    name="exam_default_passing_score"
                    type="number"
                    defaultValue={getSettingValue("exam_default_passing_score", "60")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Min Time (seconds)
                  </label>
                  <input
                    name="question_min_time"
                    type="number"
                    defaultValue={getSettingValue("question_min_time", "30")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="10"
                    max="300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Max Time (seconds)
                  </label>
                  <input
                    name="question_max_time"
                    type="number"
                    defaultValue={getSettingValue("question_max_time", "600")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="60"
                    max="1200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Min Duration (minutes)
                  </label>
                  <input
                    name="interview_min_duration"
                    type="number"
                    defaultValue={getSettingValue("interview_min_duration", "15")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="5"
                    max="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Max Duration (minutes)
                  </label>
                  <input
                    name="interview_max_duration"
                    type="number"
                    defaultValue={getSettingValue("interview_max_duration", "180")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="30"
                    max="480"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Max Questions Per Request
                  </label>
                  <input
                    name="ai_max_questions_per_request"
                    type="number"
                    defaultValue={getSettingValue("ai_max_questions_per_request", "50")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min="10"
                    max="100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update Platform Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "content" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">📝 Content Management Fields</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await updateSettings([
                { key: "content_subjects", value: formData.get("content_subjects") as string, category: "content" },
                { key: "content_topics", value: formData.get("content_topics") as string, category: "content" },
                { key: "content_tools", value: formData.get("content_tools") as string, category: "content" },
                { key: "content_technology_stacks", value: formData.get("content_technology_stacks") as string, category: "content" },
                { key: "content_domains", value: formData.get("content_domains") as string, category: "content" },
                { key: "content_skill_levels", value: formData.get("content_skill_levels") as string, category: "content" },
                { key: "content_job_roles", value: formData.get("content_job_roles") as string, category: "content" },
                { key: "content_company_types", value: formData.get("content_company_types") as string, category: "content" },
                { key: "content_interview_types", value: formData.get("content_interview_types") as string, category: "content" },
                { key: "content_categories", value: formData.get("content_categories") as string, category: "content" },
                { key: "content_target_roles", value: formData.get("content_target_roles") as string, category: "content" },
                { key: "content_programming_languages", value: formData.get("content_programming_languages") as string, category: "content" },
              ]);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects (comma-separated)
                  </label>
                  <textarea
                    name="content_subjects"
                    defaultValue={getSettingValue("content_subjects", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="programming, data-science, web-development..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topics (comma-separated)
                  </label>
                  <textarea
                    name="content_topics"
                    defaultValue={getSettingValue("content_topics", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="arrays, strings, linked-lists..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tools/Technologies (comma-separated)
                  </label>
                  <textarea
                    name="content_tools"
                    defaultValue={getSettingValue("content_tools", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="python, javascript, java..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Stacks (comma-separated)
                  </label>
                  <textarea
                    name="content_technology_stacks"
                    defaultValue={getSettingValue("content_technology_stacks", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="frontend, backend, full-stack..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domains (comma-separated)
                  </label>
                  <textarea
                    name="content_domains"
                    defaultValue={getSettingValue("content_domains", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="web, mobile, ai-ml, data..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Levels (comma-separated)
                  </label>
                  <textarea
                    name="content_skill_levels"
                    defaultValue={getSettingValue("content_skill_levels", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="beginner, intermediate, advanced"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Roles (comma-separated)
                  </label>
                  <textarea
                    name="content_job_roles"
                    defaultValue={getSettingValue("content_job_roles", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="frontend-developer, backend-developer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Types (comma-separated)
                  </label>
                  <textarea
                    name="content_company_types"
                    defaultValue={getSettingValue("content_company_types", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="tech, finance, healthcare..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Types (comma-separated)
                  </label>
                  <textarea
                    name="content_interview_types"
                    defaultValue={getSettingValue("content_interview_types", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="technical, behavioral, system-design..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories (comma-separated)
                  </label>
                  <textarea
                    name="content_categories"
                    defaultValue={getSettingValue("content_categories", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Programming, Data Structures, Algorithms..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Roles (comma-separated)
                  </label>
                  <textarea
                    name="content_target_roles"
                    defaultValue={getSettingValue("content_target_roles", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Frontend Developer, Backend Developer..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programming Languages (comma-separated)
                  </label>
                  <textarea
                    name="content_programming_languages"
                    defaultValue={getSettingValue("content_programming_languages", "")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="JavaScript, Python, Java..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update Content Fields"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "global" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">🌍 Global Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "page_size",
                    value: formData.get("page_size") as string,
                    category: "global",
                  },
                  {
                    key: "enable_search",
                    value: formData.get("enable_search") as string,
                    category: "global",
                  },
                  {
                    key: "enable_analytics",
                    value: formData.get("enable_analytics") as string,
                    category: "global",
                  },
                  {
                    key: "max_file_upload_size",
                    value: formData.get("max_file_upload_size") as string,
                    category: "global",
                  },
                  {
                    key: "feature_beta_mode",
                    value: formData.get("feature_beta_mode") as string,
                    category: "global",
                  },
                  {
                    key: "auto_refresh_interval",
                    value: formData.get("auto_refresh_interval") as string,
                    category: "global",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Page Size
                  </label>
                  <select
                    name="page_size"
                    defaultValue={getSettingValue("page_size", "20")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="10">10 items</option>
                    <option value="20">20 items</option>
                    <option value="50">50 items</option>
                    <option value="100">100 items</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enable Search
                  </label>
                  <select
                    name="enable_search"
                    defaultValue={getSettingValue("enable_search", "true")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enable Analytics
                  </label>
                  <select
                    name="enable_analytics"
                    defaultValue={getSettingValue("enable_analytics", "true")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Upload Size (MB)
                  </label>
                  <select
                    name="max_file_upload_size"
                    defaultValue={getSettingValue("max_file_upload_size", "10")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="5">5 MB</option>
                    <option value="10">10 MB</option>
                    <option value="25">25 MB</option>
                    <option value="50">50 MB</option>
                    <option value="100">100 MB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beta Features Mode
                  </label>
                  <select
                    name="feature_beta_mode"
                    defaultValue={getSettingValue("feature_beta_mode", "false")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Refresh Interval (seconds)
                  </label>
                  <select
                    name="auto_refresh_interval"
                    defaultValue={getSettingValue(
                      "auto_refresh_interval",
                      "30"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                    <option value="0">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update Global Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === "system" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6">🛠️ System Settings</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await updateSettings([
                  {
                    key: "maintenance_mode",
                    value: formData.get("maintenance_mode") as string,
                    category: "system",
                  },
                  {
                    key: "maintenance_message",
                    value: formData.get("maintenance_message") as string,
                    category: "system",
                  },
                  {
                    key: "auto_backup",
                    value: formData.get("auto_backup") as string,
                    category: "system",
                  },
                  {
                    key: "backup_retention",
                    value: formData.get("backup_retention") as string,
                    category: "system",
                  },
                  {
                    key: "log_level",
                    value: formData.get("log_level") as string,
                    category: "system",
                  },
                  {
                    key: "enable_debug_logs",
                    value: formData.get("enable_debug_logs") as string,
                    category: "system",
                  },
                ]);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Mode
                  </label>
                  <select
                    name="maintenance_mode"
                    defaultValue={getSettingValue("maintenance_mode", "false")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Message
                  </label>
                  <input
                    name="maintenance_message"
                    type="text"
                    defaultValue={getSettingValue(
                      "maintenance_message",
                      "System is under maintenance"
                    )}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter maintenance message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Backup Frequency
                  </label>
                  <select
                    name="auto_backup"
                    defaultValue={getSettingValue("auto_backup", "daily")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Retention (days)
                  </label>
                  <select
                    name="backup_retention"
                    defaultValue={getSettingValue("backup_retention", "30")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Level
                  </label>
                  <select
                    name="log_level"
                    defaultValue={getSettingValue("log_level", "info")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enable Debug Logs
                  </label>
                  <select
                    name="enable_debug_logs"
                    defaultValue={getSettingValue("enable_debug_logs", "false")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loading size="sm" text="Updating..." />
                  ) : (
                    "Update System Settings"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RouteGuard requiredRole="superadmin">
      <SettingsPageContent />
    </RouteGuard>
  );
}
