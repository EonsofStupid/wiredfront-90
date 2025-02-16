import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { APISettingsState } from "@/types/admin/settings/types";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";

export function useAPISettingsLoad(
  setUser: (user: any) => void,
  setSettings: (settings: APISettingsState) => void,
) {
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          logger.warn('No authenticated user found');
          return;
        }

        setUser(session.user);
        
        const { data: apiConfigs, error: configError } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('user_id', session.user.id);

        if (configError) {
          logger.error('Error fetching API configurations:', configError);
          throw configError;
        }

        const newSettings: APISettingsState = {
          openaiKey: '',
          huggingfaceKey: '',
          geminiKey: '',
          anthropicKey: '',
          perplexityKey: '',
          elevenLabsKey: '',
          selectedVoice: '',
          googleDriveKey: '',
          dropboxKey: '',
          awsAccessKey: '',
          awsSecretKey: '',
          githubToken: '',
          dockerToken: '',
        };
        
        apiConfigs?.forEach(config => {
          if (config.is_enabled) {
            const key = `${config.api_type}Key` as keyof APISettingsState;
            newSettings[key] = 'configured';
          }
        });

        setSettings(newSettings);
        logger.info('API settings loaded successfully');
        
      } catch (error) {
        logger.error('Error loading API settings:', error);
        toast.error("Failed to load API settings");
      }
    };

    loadSettings();
  }, [setUser, setSettings]);
}