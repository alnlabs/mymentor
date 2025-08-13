export interface Setting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface GlobalConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  description?: string;
}

export type TabType =
  | "security"
  | "general"
  | "email"
  | "users"
  | "platform"
  | "content"
  | "global"
  | "system";

export interface SettingsContextType {
  settings: Setting[];
  categories: Category[];
  globalConfigs: GlobalConfig[];
  loading: boolean;
  saving: boolean;
  message: { type: "success" | "error"; text: string } | null;
  updateSettings: (settings: Partial<Setting>[]) => Promise<void>;
  setMessage: (message: { type: "success" | "error"; text: string } | null) => void;
  getSettingValue: (key: string, defaultValue?: string) => string;
}
