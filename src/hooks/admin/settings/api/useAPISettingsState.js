import { useState } from "react";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { apiSettingsStateSchema } from "@/schemas/api";
import { safeValidate } from "@/utils/validation";
// Define default settings using the schema to ensure type consistency
const defaultSettings = {
    openaiKey: "",
    huggingfaceKey: "",
    geminiKey: "",
    anthropicKey: "",
    perplexityKey: "",
    elevenLabsKey: "",
    selectedVoice: "",
    googleDriveKey: "",
    dropboxKey: "",
    awsAccessKey: "",
    awsSecretKey: "",
    githubToken: "",
    dockerToken: "",
};
export function useAPISettingsState() {
    const [settings, setSettings] = useState(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [offlineMode, setOfflineMode] = useState(false);
    const updateSetting = (key, value) => {
        setSettings(prev => {
            const updated = { ...prev, [key]: value };
            return safeValidate(apiSettingsStateSchema, updated, prev, {
                context: 'API Settings',
                showToast: false,
                logErrors: true
            });
        });
    };
    const loadOfflineSettings = () => {
        try {
            const cached = localStorage.getItem('api_settings');
            if (cached) {
                const parsedSettings = JSON.parse(cached);
                const validatedSettings = safeValidate(apiSettingsStateSchema, parsedSettings, defaultSettings, { context: 'Cached API Settings' });
                setSettings(validatedSettings);
                setOfflineMode(true);
                toast.info('Loaded settings from offline cache');
            }
        }
        catch (error) {
            logger.error('Error loading offline settings:', error);
        }
    };
    return {
        settings,
        setSettings,
        isSaving,
        setIsSaving,
        user,
        setUser,
        updateSetting,
        offlineMode,
        loadOfflineSettings
    };
}
