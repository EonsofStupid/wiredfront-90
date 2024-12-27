import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { APISettingsState } from "@/types/store/settings/api";
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
        
        // Get API configurations
        const { data: apiConfigs, error: configError } = await supabase
          .from('api_configurations')
          .select('*')
          .eq('user_id', session.user.id);

        if (configError) {
          logger.error('Error fetching API configurations:', configError);
          throw configError;
        }

        // Map configurations to settings state
        const newSettings = {} as APISettingsState;
        
        apiConfigs?.forEach(config => {
          const key = `${config.api_type}Key`;
          if (config.is_enabled) {
            (newSettings as any)[key] = 'configured';
          }
        });

        logger.info('API settings loaded successfully');
        setSettings(newSettings);
        
      } catch (error) {
        logger.error('Error loading API settings:', error);
        toast.error("Failed to load API settings");
      }
    };

    loadSettings();
  }, [setUser, setSettings]);
}