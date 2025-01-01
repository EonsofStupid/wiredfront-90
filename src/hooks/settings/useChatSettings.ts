import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatSettings, UICustomizations, MessageBehavior } from "./types";

const defaultSettings: ChatSettings = {
  enabled: true,
  message_behavior: "enter_send",
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
        const uiCustomizations = data.ui_customizations as unknown as UICustomizations;
        setSettings({
          enabled: data.enabled ?? defaultSettings.enabled,
          message_behavior: (data.message_behavior as MessageBehavior) ?? defaultSettings.message_behavior,
          ui_customizations: {
            chatbot_name: uiCustomizations?.chatbot_name ?? defaultSettings.ui_customizations.chatbot_name,
            avatar_url: uiCustomizations?.avatar_url ?? defaultSettings.ui_customizations.avatar_url,
            placeholder_text: uiCustomizations?.placeholder_text ?? defaultSettings.ui_customizations.placeholder_text,
            theme: uiCustomizations?.theme ?? defaultSettings.ui_customizations.theme
          }
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

    // Convert UICustomizations to a plain object for JSONB compatibility
    const uiCustomizationsJson = {
      chatbot_name: settings.ui_customizations.chatbot_name,
      avatar_url: settings.ui_customizations.avatar_url,
      placeholder_text: settings.ui_customizations.placeholder_text,
      theme: settings.ui_customizations.theme
    };

    const { error } = await supabase
      .from('chat_settings')
      .upsert({
        user_id: user.id,
        enabled: settings.enabled,
        message_behavior: settings.message_behavior,
        ui_customizations: uiCustomizationsJson
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