
import React, { useEffect } from "react";
import { useChatStore, initializeChatSettings } from "../store/chatStore";
import { ChatModeProvider } from "./ChatModeProvider";
import { logger } from "@/services/chat/LoggingService";
import { useLocation } from "react-router-dom";

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { isHidden, setIsHidden } = useChatStore();
  const location = useLocation();
  
  // Determine if we're on an editor page based on URL path
  const isEditorPage = location.pathname.includes('/editor');

  useEffect(() => {
    // Initialize chat settings when the provider mounts
    const settings = initializeChatSettings();
    logger.info("Chat provider initialized", { 
      isHidden: settings.isHidden,
      position: settings.position,
      isEditorPage 
    });
    
    // Force isHidden to false to ensure chat button is visible
    if (settings.isHidden) {
      setIsHidden(false);
    }
  }, [setIsHidden, isEditorPage]);

  return <ChatModeProvider isEditorPage={isEditorPage}>{children}</ChatModeProvider>;
}
