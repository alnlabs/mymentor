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

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Category deleted successfully" });
        // Refresh categories list
        const categoriesResponse = await fetch("/api/admin/categories");
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
        }
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

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "security", label: "Security", icon: "🔐" },
    { id: "general", label: "General", icon: "⚙️" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "platform", label: "Platform", icon: "📊" },

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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
          Settings
        </h2>
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
      <div className="w-full px-6">
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SuperAdmin Credentials */}
            <Card>
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🔒 Password Policy
              </h3>
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
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ⚙️ General Settings
            </h3>
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

        {activeTab === "email" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📧 Email Settings
            </h3>
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
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              👥 User Management
            </h3>
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
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📊 Platform Settings
            </h3>
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
                    value: formData.get(
                      "ai_max_questions_per_request"
                    ) as string,
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
                    defaultValue={getSettingValue(
                      "exam_default_question_time",
                      "120"
                    )}
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
                    defaultValue={getSettingValue(
                      "exam_default_passing_score",
                      "60"
                    )}
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
                    defaultValue={getSettingValue(
                      "interview_min_duration",
                      "15"
                    )}
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
                    defaultValue={getSettingValue(
                      "interview_max_duration",
                      "180"
                    )}
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
                    defaultValue={getSettingValue(
                      "ai_max_questions_per_request",
                      "50"
                    )}
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
          <div className="space-y-6 w-full">
            {/* Unified Content Management Interface */}
            <Card>
              <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📝 Content Management Fields
              </h3>

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
                          e.target.options[e.target.selectedIndex].getAttribute(
                            "data-placeholder"
                          );

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
                      programminglanguagesList: "content_programming_languages",
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
            </Card>
          </div>
        )}

        {activeTab === "global" && (
          <Card>
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🌍 Global Settings
            </h3>
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
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🛠️ System Settings
            </h3>
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
