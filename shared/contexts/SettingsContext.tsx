"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
}

interface GlobalConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
}

interface SettingsContextType {
  settings: Setting[];
  globalConfigs: GlobalConfig[];
  loading: boolean;
  getSetting: (key: string, defaultValue?: string) => string;
  getGlobalConfig: (key: string, defaultValue?: string) => string;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Setting>[]) => Promise<boolean>;
  updateGlobalConfigs: (
    newConfigs: Partial<GlobalConfig>[]
  ) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [globalConfigs, setGlobalConfigs] = useState<GlobalConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const [settingsRes, globalConfigsRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/global-configs"),
      ]);

      const [settingsData, globalConfigsData] = await Promise.all([
        settingsRes.json(),
        globalConfigsRes.json(),
      ]);

      if (settingsData.success) {
        setSettings(settingsData.data);
        // Cache in localStorage for performance
        localStorage.setItem("app_settings", JSON.stringify(settingsData.data));
      }

      if (globalConfigsData.success) {
        setGlobalConfigs(globalConfigsData.data);
        // Cache in localStorage for performance
        localStorage.setItem(
          "app_global_configs",
          JSON.stringify(globalConfigsData.data)
        );
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Fallback to cached settings
      const cachedSettings = localStorage.getItem("app_settings");
      const cachedGlobalConfigs = localStorage.getItem("app_global_configs");

      if (cachedSettings) {
        setSettings(JSON.parse(cachedSettings));
      }
      if (cachedGlobalConfigs) {
        setGlobalConfigs(JSON.parse(cachedGlobalConfigs));
      }
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: string, defaultValue: string = ""): string => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || defaultValue;
  };

  const getGlobalConfig = (key: string, defaultValue: string = ""): string => {
    const config = globalConfigs.find((c) => c.key === key);
    return config?.value || defaultValue;
  };

  const refreshSettings = async () => {
    setLoading(true);
    await fetchSettings();
  };

  const updateSettings = async (
    newSettings: Partial<Setting>[]
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      });

      const result = await response.json();
      if (result.success) {
        await refreshSettings();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating settings:", error);
      return false;
    }
  };

  const updateGlobalConfigs = async (
    newConfigs: Partial<GlobalConfig>[]
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/global-configs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: newConfigs }),
      });

      const result = await response.json();
      if (result.success) {
        await refreshSettings();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating global configs:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value: SettingsContextType = {
    settings,
    globalConfigs,
    loading,
    getSetting,
    getGlobalConfig,
    refreshSettings,
    updateSettings,
    updateGlobalConfigs,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
