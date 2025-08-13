"use client";

import React from "react";
import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import { SettingsContextType } from "../types";

interface EmailTabProps {
  context: SettingsContextType;
}

export default function EmailTab({ context }: EmailTabProps) {
  const { getSettingValue, updateSettings } = context;

  return (
    <div className="space-y-6">
      {/* Email Settings */}
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
                key: "smtp_host",
                value: formData.get("smtp_host") as string,
                category: "email",
              },
              {
                key: "smtp_port",
                value: formData.get("smtp_port") as string,
                category: "email",
              },
              {
                key: "smtp_username",
                value: formData.get("smtp_username") as string,
                category: "email",
              },
              {
                key: "smtp_password",
                value: formData.get("smtp_password") as string,
                category: "email",
              },
              {
                key: "smtp_secure",
                value: formData.get("smtp_secure") as string,
                category: "email",
              },
              {
                key: "from_email",
                value: formData.get("from_email") as string,
                category: "email",
              },
              {
                key: "from_name",
                value: formData.get("from_name") as string,
                category: "email",
              },
            ]);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                name="smtp_host"
                defaultValue={getSettingValue("smtp_host", "smtp.gmail.com")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                name="smtp_port"
                defaultValue={getSettingValue("smtp_port", "587")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Username
              </label>
              <input
                type="email"
                name="smtp_username"
                defaultValue={getSettingValue("smtp_username", "")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Password
              </label>
              <input
                type="password"
                name="smtp_password"
                defaultValue={getSettingValue("smtp_password", "")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Security
              </label>
              <select
                name="smtp_secure"
                defaultValue={getSettingValue("smtp_secure", "tls")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="false">None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Email
              </label>
              <input
                type="email"
                name="from_email"
                defaultValue={getSettingValue("from_email", "noreply@mymentor.com")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                name="from_name"
                defaultValue={getSettingValue("from_name", "Interview Platform")}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              💾 Save Email Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
