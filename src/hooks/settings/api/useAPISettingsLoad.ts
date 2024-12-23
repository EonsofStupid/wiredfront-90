import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { isSettingValue, SettingValue } from "../types";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";

interface DecryptedValue {
  key: string;
  [key: string]: any;
}

export function useAPISettingsLoad(
  setUser: (user: any) => void,
  setSettings: (settings: APISettingsState) => void,
) {
  const navigate = useNavigate();

  useEffect(() => {
    let retryCount = 0;
    let retryTimeout: NodeJS.Timeout;

    const loadSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Please log in to manage API settings");
          navigate("/login");
          return;
        }
        setUser(session.user);

        if (session.user) {
          // Load API configurations
          const { data: configs, error: configError } = await supabase
            .from('api_configurations')
            .select('*')
            .eq('user_id', session.user.id);

          if (configError) throw configError;

          // Load settings
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
            .eq('user_id', session.user.id);

          if (userSettingsError) throw userSettingsError;

          if (userSettings) {
            const newSettings = {} as APISettingsState;
            
            await Promise.all(userSettings.map(async (setting) => {
              let settingValue: SettingValue | null = null;
              
              if (setting.encrypted_value) {
                const { data: decrypted } = await supabase.rpc('decrypt_setting_value', {
                  encrypted_value: setting.encrypted_value
                });
                settingValue = decrypted as SettingValue;
              } else if (isSettingValue(setting.value)) {
                settingValue = setting.value;
              }
              
              if (!settingValue?.key) return;
              
              const settingKey = Object.entries(settingKeyToId).find(
                ([_, id]) => id === setting.setting_id
              )?.[0];

              if (!settingKey) return;

              const key = settingKey.replace(/-api-key$/, "Key")
                .replace(/-token$/, "Token")
                .replace(/^aws-/, "aws")
                .replace(/^google-drive/, "googleDrive")
                .replace(/^elevenlabs-voice/, "selectedVoice");

              (newSettings as any)[key] = settingValue.key;
            }));
            
            // Cache settings for offline use
            localStorage.setItem('api_settings', JSON.stringify({
              ...newSettings,
              configs: configs || []
            }));
            
            setSettings(newSettings);
            logger.info('API settings loaded successfully');
          }
        }
      } catch (error) {
        logger.error('Error loading settings:', error);
        
        if (retryCount < 3) {
          retryCount++;
          retryTimeout = setTimeout(loadSettings, 1000 * Math.pow(2, retryCount));
          toast.error(`Failed to load API settings. Retrying... (${retryCount}/3)`);
        } else {
          toast.error("Failed to load API settings. Loading from offline cache...");
          const cached = localStorage.getItem('api_settings');
          if (cached) {
            try {
              const offlineSettings = JSON.parse(cached);
              setSettings(offlineSettings);
              toast.info('Loaded settings from offline cache');
            } catch (error) {
              logger.error('Error parsing cached settings:', error);
              toast.error('Failed to load cached settings');
            }
          }
        }
      }
    };

    loadSettings();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [navigate, setSettings, setUser]);
}