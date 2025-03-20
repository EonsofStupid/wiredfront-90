import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
export function useAPISettingsLoad(setUser, setSettings) {
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
                // Initialize with empty strings, matching our type definition
                const newSettings = {
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
                        const key = `${config.api_type}Key`;
                        // Use type assertion since we know this is safe
                        if (key in newSettings) {
                            newSettings[key] = 'configured';
                        }
                    }
                });
                setSettings(newSettings);
                logger.info('API settings loaded successfully');
            }
            catch (error) {
                logger.error('Error loading API settings:', error);
                toast.error("Failed to load API settings");
            }
        };
        loadSettings();
    }, [setUser, setSettings]);
}
