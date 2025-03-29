
import React, { createContext, useEffect } from 'react';
import { chatBridge } from './ChatBridge';
import { ChatBridgeInterface } from '@/components/chat/types/chat/bridge';
import { logger } from '@/services/chat/LoggingService';

// Create a context for the ChatBridge
export const ChatBridgeContext = createContext<ChatBridgeInterface | null>(null);

interface ChatBridgeProviderProps {
  children: React.ReactNode;
  userSettings?: Record<string, any>;
  adminSettings?: Record<string, any>;
}

/**
 * Provider component for ChatBridge
 * Makes the ChatBridge instance available throughout the application
 */
export function ChatBridgeProvider({ 
  children, 
  userSettings,
  adminSettings
}: ChatBridgeProviderProps) {
  // Apply user settings to ChatBridge on mount and when changed
  useEffect(() => {
    if (userSettings) {
      logger.info('Applying user settings to ChatBridge');
      chatBridge.updateSettings(userSettings);
    }
  }, [userSettings]);

  // Apply admin settings to ChatBridge on mount and when changed
  useEffect(() => {
    if (adminSettings) {
      logger.info('Applying admin settings to ChatBridge');
      chatBridge.setAdminSettings(adminSettings);
    }
  }, [adminSettings]);

  return (
    <ChatBridgeContext.Provider value={chatBridge}>
      {children}
    </ChatBridgeContext.Provider>
  );
}
