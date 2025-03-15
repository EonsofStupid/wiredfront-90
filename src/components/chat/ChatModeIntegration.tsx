
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatStore } from './store/chatStore';
import { ImageChatManager } from './features/image-gallery/ImageChatManager';
import { logger } from '@/services/chat/LoggingService';

export function ChatModeIntegration() {
  const location = useLocation();
  const { 
    currentMode, 
    setCurrentMode, 
    getCurrentPageMode,
    createSession,
    currentSession,
    clearSessions
  } = useChatStore();
  
  // Effect to sync the chat mode with the current page
  useEffect(() => {
    const pageMode = getCurrentPageMode();
    
    // If we don't have a current session or its mode doesn't match the page mode,
    // create a new one with the appropriate mode
    if (pageMode !== currentMode) {
      logger.info(`Switching chat mode from ${currentMode} to ${pageMode} based on page`);
      setCurrentMode(pageMode);
      
      // If we don't have a session for this mode, create one
      if (!currentSession || currentSession.mode !== pageMode) {
        // For dev mode, we want to clear existing sessions to prevent confusion
        if (pageMode === 'dev') {
          logger.info('Clearing sessions for dev mode');
          clearSessions();
        }
        
        // Create a session with the appropriate title
        const sessionTitle = pageMode === 'dev' 
          ? 'Development Session' 
          : pageMode === 'image'
            ? 'Image Generation'
            : pageMode === 'training'
              ? 'Training Session'
              : 'Chat Session';
              
        logger.info(`Creating new session for ${pageMode} mode`);
        createSession(pageMode, { title: sessionTitle });
      }
    }
  }, [location.pathname, getCurrentPageMode, currentMode, setCurrentMode, createSession, currentSession, clearSessions]);
  
  return (
    <>
      {/* Load mode-specific managers */}
      {currentMode === 'image' && <ImageChatManager />}
    </>
  );
}
