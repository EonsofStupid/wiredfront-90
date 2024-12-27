import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";
import { isSettingValue, SettingValue } from "../types";
import { APISettingsState } from "@/types/store/settings/api";
import { logger } from "@/services/chat/LoggingService";

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
          logger.warn('No authenticated user found');
          return;
        }
        setUser(session.user);

        if (session.user) {
          logger.info('Loading API settings...');
          
          const { data: userSettings, error: userSettingsError } = await supabase
            .from('user_settings')
            .select('setting_id, value, encrypted_value')
            .eq('user_id', session.user.id);

          if (userSettingsError) {
            logger.error('Error fetching user settings:', userSettingsError);
            throw userSettingsError;
          }

          logger.info('Fetched user settings');

          if (userSettings) {
            const newSettings = {} as APISettingsState;
            
            for (const setting of userSettings) {
              let settingValue: SettingValue | null = null;
              
              if (setting.encrypted_value) {
                const { data: decrypted } = await supabase.rpc('decrypt_setting_value', {
                  encrypted_value: setting.encrypted_value
                });
                settingValue = decrypted as SettingValue;
              } else if (isSettingValue(setting.value)) {
                settingValue = setting.value;
              }
              
              if (settingValue?.key) {
                const { data: settingInfo } = await supabase
                  .from('settings')
                  .select('key')
                  .eq('id', setting.setting_id)
                  .single();

                if (settingInfo) {
                  const key = settingInfo.key
                    .replace(/-api-key$/, "Key")
                    .replace(/-token$/, "Token")
                    .replace(/^aws-/, "aws")
                    .replace(/^google-drive/, "googleDrive")
                    .replace(/^elevenlabs-voice/, "selectedVoice");

                  (newSettings as any)[key] = settingValue.key;
                }
              }
            }
            
            logger.info('Setting processed API settings');
            setSettings(newSettings);
          }
        }
      } catch (error) {
        logger.error('Error loading settings:', error);
        
        if (retryCount < 3) {
          retryCount++;
          retryTimeout = setTimeout(loadSettings, 1000 * Math.pow(2, retryCount));
          toast.error(`Failed to load API settings. Retrying... (${retryCount}/3)`);
        }
      }
    };

    loadSettings();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [navigate, setSettings, setUser]);
}