
import { useEffect } from 'react';
import { useChatBridge } from '@/components/chat/chatbridge/useChatBridge';
import { useChatStore } from '@/components/chat/store/chatStore';
import { logger } from '@/services/chat/LoggingService';

export function useChatBridgeSync() {
  const { updateSettings: updateBridgeSettings, settings: bridgeSettings } = useChatBridge();
  const { settings: storeSettings, updateSettings: updateStoreSettings } = useChatStore();

  // Sync store settings to bridge
  useEffect(() => {
    try {
      updateBridgeSettings({
        appearance: {
          position: storeSettings.appearance.position,
          buttonStyle: storeSettings.appearance.buttonStyle,
          buttonSize: storeSettings.appearance.buttonSize,
          buttonColor: storeSettings.appearance.buttonColor,
        },
        notifications: {
          sound: storeSettings.notifications.soundEnabled,
          desktop: storeSettings.notifications.desktopNotifications,
        },
        chatWidth: storeSettings.appearance.chatWidth || 400,
        chatHeight: storeSettings.appearance.chatHeight || 600
      });
      
      logger.info('Synced store settings to bridge', { storeSettings });
    } catch (error) {
      logger.error('Failed to sync store settings to bridge', error);
    }
  }, [storeSettings, updateBridgeSettings]);

  // Update store from bridge when it changes
  const syncBridgeToStore = () => {
    try {
      updateStoreSettings({
        appearance: {
          position: bridgeSettings.appearance.position,
          buttonStyle: bridgeSettings.appearance.buttonStyle,
          buttonSize: bridgeSettings.appearance.buttonSize,
          buttonColor: bridgeSettings.appearance.buttonColor,
          chatWidth: bridgeSettings.chatWidth, 
          chatHeight: bridgeSettings.chatHeight
        },
        notifications: {
          soundEnabled: bridgeSettings.notifications.sound,
          desktopNotifications: bridgeSettings.notifications.desktop,
        },
      });
      
      logger.info('Synced bridge settings to store', { bridgeSettings });
    } catch (error) {
      logger.error('Failed to sync bridge settings to store', error);
    }
  };

  return {
    syncBridgeToStore,
    bridgeSettings
  };
}
