
import React from 'react';
import { CoreLayout } from '@/core/layout/CoreLayout';
import { ChatBridgeProvider } from '@/modules/ChatBridge/ChatBridgeProvider';
import { ModeProvider } from '@/modules/ModeManager';
import { ChatContainer } from '@/components/chat';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // Example of how user settings could be passed to the chat bridge
  const userSettings = {
    theme: 'cyberpunk',
    fontSize: 'medium',
    soundEnabled: true
  };
  
  // Example of how admin settings could be passed to the chat bridge
  const adminSettings = {
    debugMode: false,
    apiKeys: {
      provider: 'openai'
    }
  };
  
  return (
    <ChatBridgeProvider userSettings={userSettings} adminSettings={adminSettings}>
      <ModeProvider>
        <CoreLayout>
          {children}
          <ChatContainer />
        </CoreLayout>
      </ModeProvider>
    </ChatBridgeProvider>
  );
};

export default MainLayout;
