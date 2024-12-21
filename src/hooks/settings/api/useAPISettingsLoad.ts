import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isSettingValue } from "../types";
import { APISettingsState } from "@/types/store/settings/api";

export function useAPISettingsLoad(
  setUser: (user: any) => void,
  setSettings: (settings: APISettingsState) => void,
) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to manage API settings");
        navigate("/login");
        return;
      }
      setUser(session.user);

      if (session.user) {
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
            .select('setting_id, value')
            .eq('user_id', session.user.id);

          if (userSettingsError) throw userSettingsError;

          if (userSettings) {
            const newSettings = {} as APISettingsState;
            userSettings.forEach(setting => {
              if (!isSettingValue(setting.value)) return;
              
              const settingKey = Object.entries(settingKeyToId).find(
                ([_, id]) => id === setting.setting_id
              )?.[0];

              if (!settingKey) return;

              const key = settingKey.replace(/-api-key$/, "Key")
                .replace(/-token$/, "Token")
                .replace(/^aws-/, "aws")
                .replace(/^google-drive/, "googleDrive")
                .replace(/^elevenlabs-voice/, "selectedVoice");

              (newSettings as any)[key] = setting.value.key;
            });
            setSettings(newSettings);
          }
        } catch (error) {
          console.error('Error loading settings:', error);
          toast.error("Failed to load API settings");
        }
      }
    };

    checkAuth();
  }, [navigate, setSettings, setUser]);
}