import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface SettingValue {
  key: string;
}

function isSettingValue(value: unknown): value is SettingValue {
  return (
    typeof value === 'object' && 
    value !== null && 
    'key' in value && 
    typeof (value as SettingValue).key === 'string'
  );
}

export interface APISettingsState {
  openaiKey: string;
  huggingfaceKey: string;
  geminiKey: string;
  anthropicKey: string;
  perplexityKey: string;
  elevenLabsKey: string;
  selectedVoice: string;
  googleDriveKey: string;
  dropboxKey: string;
  awsAccessKey: string;
  awsSecretKey: string;
  githubToken: string;
  dockerToken: string;
}

export function useAPISettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<APISettingsState>({
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
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to manage API settings.",
          variant: "destructive"
        });
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
            const newSettings = { ...settings };
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
          toast({
            title: "Error",
            description: "Failed to load API settings.",
            variant: "destructive"
          });
        }
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save API settings.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      const { data: allSettings, error: settingsError } = await supabase
        .from('settings')
        .select('id, key');
      
      if (settingsError) throw settingsError;

      const settingKeyToId = allSettings?.reduce((acc: Record<string, string>, setting) => {
        acc[setting.key] = setting.id;
        return acc;
      }, {}) || {};

      const apiKeys = {
        'openai-api-key': settings.openaiKey,
        'huggingface-api-key': settings.huggingfaceKey,
        'gemini-api-key': settings.geminiKey,
        'anthropic-api-key': settings.anthropicKey,
        'perplexity-api-key': settings.perplexityKey,
        'elevenlabs-api-key': settings.elevenLabsKey,
        'elevenlabs-voice': settings.selectedVoice,
        'google-drive-api-key': settings.googleDriveKey,
        'dropbox-api-key': settings.dropboxKey,
        'aws-access-key': settings.awsAccessKey,
        'aws-secret-key': settings.awsSecretKey,
        'github-token': settings.githubToken,
        'docker-token': settings.dockerToken,
      };

      for (const [key, value] of Object.entries(apiKeys)) {
        if (value && settingKeyToId[key]) {
          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              setting_id: settingKeyToId[key],
              value: { key: value }
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "API settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast({
        title: "Error",
        description: "Failed to save API settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof APISettingsState, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    isSaving,
    handleSave,
    user
  };
}