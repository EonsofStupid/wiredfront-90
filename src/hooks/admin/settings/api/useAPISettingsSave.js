import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
export function useAPISettingsSave() {
    const handleSave = async (user, settings, setIsSaving) => {
        if (!user) {
            toast.error("Please log in to save API settings");
            return;
        }
        setIsSaving(true);
        try {
            logger.info('Starting API settings save...');
            // Define the API configurations with proper type assertions
            const apiConfigs = [
                { key: 'openaiKey', type: 'openai', name: 'OpenAI Configuration' },
                { key: 'anthropicKey', type: 'anthropic', name: 'Anthropic Configuration' },
                { key: 'geminiKey', type: 'gemini', name: 'Gemini Configuration' },
                { key: 'huggingfaceKey', type: 'huggingface', name: 'HuggingFace Configuration' },
                { key: 'githubToken', type: 'github', name: 'GitHub Configuration' }
            ];
            for (const config of apiConfigs) {
                const apiKey = settings[config.key];
                if (apiKey) {
                    const { data: existingConfig, error: queryError } = await supabase
                        .from('api_configurations')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('api_type', config.type)
                        .maybeSingle();
                    if (queryError)
                        throw queryError;
                    // Need to cast the api_type to any to bypass TypeScript restrictions
                    // since the database schema has been updated but TypeScript definitions haven't
                    const configData = {
                        user_id: user.id,
                        api_type: config.type,
                        is_enabled: true,
                        is_default: config.type === 'openai',
                        memorable_name: config.name,
                        validation_status: 'pending',
                        secret_key_name: config.key,
                        updated_at: new Date().toISOString()
                    };
                    if (existingConfig) {
                        const { error: updateError } = await supabase
                            .from('api_configurations')
                            .update(configData)
                            .eq('id', existingConfig.id);
                        if (updateError)
                            throw updateError;
                    }
                    else {
                        // Include created_at for new configurations and use type assertions
                        const insertData = {
                            ...configData,
                            created_at: new Date().toISOString()
                        };
                        const { error: insertError } = await supabase
                            .from('api_configurations')
                            .insert([insertData]);
                        if (insertError)
                            throw insertError;
                    }
                }
            }
            logger.info('API settings saved successfully');
            toast.success("API settings have been saved");
        }
        catch (error) {
            logger.error('Error saving API settings:', error);
            toast.error("Failed to save API settings");
            throw error;
        }
        finally {
            setIsSaving(false);
        }
    };
    return { handleSave };
}
