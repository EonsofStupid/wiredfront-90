
import { useCallback, useEffect } from 'react';
import { ChatBridge } from '@/components/chat/chatbridge/ChatBridge';
import { useSettingsStore } from '@/stores/settings';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { ChatSettings } from '@/utils/storage/chat-settings';

/**
 * Hook for syncing settings between the chat bridge and settings store
 */
export function useChatBridgeSync() {
  const preferences = useSettingsStore(state => state.preferences);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);

  // Sync store changes to bridge
  const syncBridgeToStore = useCallback(() => {
    try {
      logger.info('Syncing settings from store to bridge');
      
      // Get chat interface settings
      const chatSettings = preferences.chatSettings as unknown as ChatSettings;
      
      if (chatSettings?.appearance) {
        // Update the chat bridge with the current settings
        ChatBridge.configure({
          appearance: {
            position: chatSettings.appearance.position,
            buttonStyle: chatSettings.appearance.buttonStyle,
            buttonSize: chatSettings.appearance.buttonSize,
            buttonColor: chatSettings.appearance.buttonColor,
            chatWidth: chatSettings.appearance.chatWidth || 400, // Default value if not present
            chatHeight: chatSettings.appearance.chatHeight || 500, // Default value if not present
          },
          behavior: chatSettings.behavior,
          notifications: chatSettings.notifications,
          providers: chatSettings.providers,
        });
      }
    } catch (error) {
      logger.error('Error syncing settings to bridge', { error });
      toast.error('Failed to apply chat settings');
    }
  }, [preferences]);
  
  // Sync bridge to store on mount
  useEffect(() => {
    syncBridgeToStore();
  }, [syncBridgeToStore]);
  
  return { syncBridgeToStore };
}
