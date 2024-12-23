import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isSettingValue } from "../types";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";
import { Json } from "@/integrations/supabase/types";

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

interface DecryptedValue {
  key: string;
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
              let value: string | null = null;
              
              if (setting.encrypted_value) {
                const decrypted = await decryptValue(setting.encrypted_value);
                value = decrypted;
              } else {
                value = isSettingValue(setting.value) ? setting.value.key : null;
              }
              
              if (!value) return;
              
              const settingKey = Object.entries(settingKeyToId).find(
                ([_, id]) => id === setting.setting_id
              )?.[0];

              if (!settingKey) return;

              const key = settingKey.replace(/-api-key$/, "Key")
                .replace(/-token$/, "Token")
                .replace(/^aws-/, "aws")
                .replace(/^google-drive/, "googleDrive")
                .replace(/^elevenlabs-voice/, "selectedVoice");

              (newSettings as any)[key] = value;
            }));
            
            // Cache settings for offline use
            localStorage.setItem('api_settings', JSON.stringify(newSettings));
            
            setSettings(newSettings);
            logger.info('API settings loaded successfully');
          }
        }
      } catch (error) {
        logger.error('Error loading settings:', error);
        
        if (retryCount < RETRY_ATTEMPTS) {
          retryCount++;
          retryTimeout = setTimeout(loadSettings, RETRY_DELAY * Math.pow(2, retryCount));
          toast.error(`Failed to load API settings. Retrying... (${retryCount}/${RETRY_ATTEMPTS})`);
        } else {
          toast.error("Failed to load API settings. Loading from offline cache...");
          const offlineSettings = loadOfflineSettings();
          if (offlineSettings) {
            setSettings(offlineSettings);
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

const decryptValue = async (encryptedValue: any): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('decrypt_setting_value', {
      encrypted_value: encryptedValue
    });
    if (error) throw error;
    
    // Check if data is an object with a key property
    if (data && typeof data === 'object' && 'key' in data) {
      return (data as DecryptedValue).key;
    }
    return null;
  } catch (error) {
    logger.error('Error decrypting value:', error);
    return null;
  }
};

const loadOfflineSettings = (): APISettingsState | null => {
  try {
    const cached = localStorage.getItem('api_settings');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    logger.error('Error loading offline settings:', error);
  }
  return null;
};