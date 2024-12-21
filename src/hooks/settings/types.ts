import { APISettingsState } from "@/types/store/settings";

export interface UseAPISettingsReturn {
  settings: APISettingsState;
  updateSetting: (key: keyof APISettingsState, value: string) => void;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  user: any;
}

export interface SettingValue {
  key: string;
}

export function isSettingValue(value: unknown): value is SettingValue {
  return (
    typeof value === 'object' && 
    value !== null && 
    'key' in value && 
    typeof (value as SettingValue).key === 'string'
  );
}