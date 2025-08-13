"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface GeneralTabProps {
  context: SettingsContextType;
}

export default function GeneralTab({ context }: GeneralTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6">
      {/* General Settings */}
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
                key: "site_name",
                value: formData.get("site_name") as string,
                category: "general",
              },
              {
                key: "site_description",
                value: formData.get("site_description") as string,
                category: "general",
              },
              {
                key: "timezone",
                value: formData.get("timezone") as string,
                category: "general",
              },
              {
                key: "date_format",
                value: formData.get("date_format") as string,
                category: "general",
              },
              {
                key: "time_format",
                value: formData.get("time_format") as string,
                category: "general",
              },
              {
                key: "language",
                value: formData.get("language") as string,
                category: "general",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                name="site_name"
                defaultValue={getSettingValue("site_name", "Interview Platform")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <input
                type="text"
                name="site_description"
                defaultValue={getSettingValue(
                  "site_description",
                  "Advanced Interview Management Platform"
                )}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                defaultValue={getSettingValue("timezone", "UTC")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Shanghai">Shanghai</option>
                <option value="Asia/Kolkata">Mumbai</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                name="date_format"
                defaultValue={getSettingValue("date_format", "MM/DD/YYYY")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Format
              </label>
              <select
                name="time_format"
                defaultValue={getSettingValue("time_format", "12")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="12">12-hour</option>
                <option value="24">24-hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                name="language"
                defaultValue={getSettingValue("language", "en")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save General Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
