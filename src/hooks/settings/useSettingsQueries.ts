import { supabase } from '@/integrations/supabase/client';
import { isSettingValue } from './types';
import { toast } from 'sonner';

export async function fetchUserSettings(userId: string) {
  try {
    const { data: allSettings, error: settingsError } = await supabase
      .from('settings')
      .select('id, key');
    
    if (settingsError) throw settingsError;

    const settingKeyToId = allSettings?.reduce((acc: Record<string, string>, setting) => {
      acc[setting.key] = setting.id;
      return acc;
    }, {}) || {};

    const { data: userSettings, error: userSettingsError } = await supabase
      .from('user_settings')
      .select('setting_id, value, encrypted_value')
      .eq('user_id', userId);

    if (userSettingsError) throw userSettingsError;

    return { settingKeyToId, userSettings };
  } catch (error) {
    console.error('Error fetching settings:', error);
    toast.error('Failed to load API settings');
    throw error;
  }
}

export async function saveUserSetting(
  userId: string,
  settingId: string,
  value: string
) {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        setting_id: settingId,
        value: { key: value }
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving setting:', error);
    toast.error('Failed to save setting');
    throw error;
  }
}