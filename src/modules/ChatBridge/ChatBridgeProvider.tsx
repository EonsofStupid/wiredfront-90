
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ChatBridge } from './ChatBridge';

// Context for the chat bridge
export const ChatBridgeContext = createContext<ChatBridge | undefined>(undefined);

interface ChatBridgeProviderProps {
  children: ReactNode;
  userSettings?: Record<string, any>; // Optional user settings from parent app
  adminSettings?: Record<string, any>; // Optional admin settings from parent app
}

/**
 * ChatBridgeProvider serves as the isolation boundary between the chat client
 * and the rest of the application. All communication goes through the ChatBridge.
 */
export const ChatBridgeProvider: React.FC<ChatBridgeProviderProps> = ({ 
  children, 
  userSettings, 
  adminSettings 
}) => {
  // Create a new ChatBridge instance
  const [chatBridge] = useState(() => new ChatBridge());
  
  // Apply any user or admin settings passed from parent application
  useEffect(() => {
    if (userSettings) {
      chatBridge.setUserSettings(userSettings);
      console.log('ChatBridge: User settings applied', userSettings);
    }
  }, [chatBridge, userSettings]);

  useEffect(() => {
    if (adminSettings) {
      chatBridge.setAdminSettings(adminSettings);
      console.log('ChatBridge: Admin settings applied', adminSettings);
    }
  }, [chatBridge, adminSettings]);
  
  return (
    <ChatBridgeContext.Provider value={chatBridge}>
      {children}
    </ChatBridgeContext.Provider>
  );
};
