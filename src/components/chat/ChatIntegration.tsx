
import React, { useEffect } from 'react';
import { ChatModeIntegration } from './ChatModeIntegration';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from './store/chatStore';
import { useMessageStore } from './messaging/MessageManager';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

export function ChatIntegration() {
  const { user } = useAuthStore();
  const session = useSession();
  const { initialized, initializeChatSettings } = useChatStore();
  const { clearMessages } = useMessageStore();
  
  // Initialize chat settings on mount
  useEffect(() => {
    if (!initialized) {
      logger.info('Initializing chat settings');
      initializeChatSettings();
    }
  }, [initialized, initializeChatSettings]);
  
  // Listen for GitHub webhook events
  useEffect(() => {
    if (!user || !session) return;
    
    const githubChannel = supabase
      .channel('github-events')
      .on('broadcast', { event: 'github_update' }, (payload) => {
        logger.info('Received GitHub update event', payload);
        
        // Show notification for GitHub updates
        if (payload.payload && payload.payload.repository) {
          const { repository, commit } = payload.payload;
          
          // Display notification using the browser API
          if (Notification.permission === 'granted') {
            new Notification('GitHub Repository Updated', {
              body: `${repository.name} was updated with commit: ${commit.message}`,
              icon: '/logo.png'
            });
          }
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(githubChannel);
    };
  }, [user, session]);
  
  return (
    <>
      <ChatModeIntegration />
    </>
  );
}
