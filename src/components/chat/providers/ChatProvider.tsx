
import React, { useEffect } from "react";
import { useChatStore, initializeChatSettings } from "../store/chatStore";
import { ChatModeProvider } from "./ChatModeProvider";
import { logger } from "@/services/chat/LoggingService";

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { isHidden, setIsHidden } = useChatStore();

  useEffect(() => {
    // Initialize chat settings when the provider mounts
    const settings = initializeChatSettings();
    logger.info("Chat provider initialized", { 
      isHidden: settings.isHidden,
      position: settings.position 
    });
    
    // Force isHidden to false to ensure chat button is visible
    if (settings.isHidden) {
      setIsHidden(false);
    }
  }, [setIsHidden]);

  return <ChatModeProvider>{children}</ChatModeProvider>;
}
