import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UICustomizations {
  chatbot_name: string;
  avatar_url: string | null;
  placeholder_text: string;
  theme: string;
}

interface ChatSettings {
  enabled: boolean;
  message_behavior: 'enter_send' | 'enter_newline';
  ui_customizations: UICustomizations;
}

const defaultSettings: ChatSettings = {
  enabled: true,
  message_behavior: 'enter_send',
  ui_customizations: {
    chatbot_name: 'AI Assistant',
    avatar_url: null,
    placeholder_text: 'Type a message...',
    theme: 'default'
  }
};

export function useChatSettings() {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chat_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          enabled: data.enabled,
          message_behavior: data.message_behavior,
          ui_customizations: data.ui_customizations
        });
      }
    } catch (error) {
      console.error('Error loading chat settings:', error);
      toast.error("Failed to load chat settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (updates: Partial<ChatSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  const saveSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to save settings");
      return;
    }

    const { error } = await supabase
      .from('chat_settings')
      .upsert({
        user_id: user.id,
        enabled: settings.enabled,
        message_behavior: settings.message_behavior,
        ui_customizations: settings.ui_customizations
      });

    if (error) {
      throw error;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    saveSettings
  };
}