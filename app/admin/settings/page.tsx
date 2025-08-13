"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { Loading } from "@/shared/components/Loading";
import { RouteGuard } from "@/shared/components/RouteGuard";
import {
  SecurityTab,
  GeneralTab,
  EmailTab,
  UsersTab,
  PlatformTab,
  ContentTab,
  GlobalTab,
  SystemTab,
} from "./components";
import { SettingsContextType, TabType } from "./types";

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

  const updateSettings = async (newSettings: Partial<Setting>[]) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
        fetchAllData(); // Refresh data
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

  const getSettingValue = (key: string, defaultValue: string = "") => {
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  // Create context object to pass to components
  const context: SettingsContextType = {
    settings,
    categories,
    globalConfigs,
    loading,
    saving,
    message,
    updateSettings,
    setMessage,
    getSettingValue,
  };

  const tabs = [
    { id: "security" as TabType, name: "Security", icon: "🔒" },
    { id: "general" as TabType, name: "General", icon: "⚙️" },
    { id: "email" as TabType, name: "Email", icon: "📧" },
    { id: "users" as TabType, name: "Users", icon: "👥" },
    { id: "platform" as TabType, name: "Platform", icon: "🚀" },
    { id: "content" as TabType, name: "Content", icon: "📝" },
    { id: "global" as TabType, name: "Global", icon: "🌍" },
    { id: "system" as TabType, name: "System", icon: "⚙️" },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Settings
          </h2>
          <p className="text-white opacity-90">
            Manage your application settings and configurations
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full px-6">
          {activeTab === "security" && <SecurityTab context={context} />}
          {activeTab === "general" && <GeneralTab context={context} />}
          {activeTab === "email" && <EmailTab context={context} />}
          {activeTab === "users" && <UsersTab context={context} />}
          {activeTab === "platform" && <PlatformTab context={context} />}
          {activeTab === "content" && <ContentTab context={context} />}
          {activeTab === "global" && <GlobalTab context={context} />}
          {activeTab === "system" && <SystemTab context={context} />}
        </div>
      </div>
    </RouteGuard>
  );
}

export default function SettingsPage() {
  return <SettingsPageContent />;
}
