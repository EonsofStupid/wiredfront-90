
import React, { useRef, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { ChatSidebar } from "./chat-structure/sidebar/ChatSidebar";
import { ChatToggleButton } from "./shared/ChatToggleButton";
import { ChatContainer as ChatContainerComponent } from "./chat-structure/container/ChatContainer";
import { useViewportAwareness } from "./hooks/useViewportAwareness";
import { useChatStore } from "./store/chatStore";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";
import { useChatBridge } from "@/modules/ChatBridge";
import { useMode } from "@/modules/ModeManager";

// Import chat styles (only imported once)
import "./styles/index.css";

export function ChatContainer() {
  const { 
    isOpen, 
    toggleChat, 
    position, 
    isMinimized, 
    showSidebar, 
    scale 
  } = useChatStore();
  
  const { containerRef, isOverflowing } = useViewportAwareness();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const chatBridge = useChatBridge();
  const { isEditorPage } = useMode();

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isMinimized]);

  // Log significant chat state changes
  useEffect(() => {
    logger.info('Chat state updated', { 
      isOpen, 
      position, 
      isMinimized, 
      showSidebar,
      scale,
      isOverflowing,
      path: location.pathname
    });
  }, [isOpen, position, isMinimized, showSidebar, scale, isOverflowing, location.pathname]);

  // Register with ChatBridge for external events
  useEffect(() => {
    // Set up listeners for external events
    const unsubscribeMessage = chatBridge.on('message', (message) => {
      console.log('Received message from app:', message);
      // Handle message from the main app
    });
    
    const unsubscribeSettings = chatBridge.on('userSettingsChanged', (settings) => {
      console.log('User settings updated:', settings);
      // Apply user settings to chat
    });
    
    // Sync chat store state with chatBridge
    const chatState = chatBridge.getState();
    if (isOpen !== chatState.isOpen) {
      if (chatState.isOpen) {
        toggleChat();
      }
    }
    
    return () => {
      unsubscribeMessage();
      unsubscribeSettings();
    };
  }, [chatBridge, isOpen, toggleChat]);

  if (!isOpen) {
    return <ChatToggleButton onClick={toggleChat} />;
  }

  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <DndContext>
      <motion.div 
        className={`fixed bottom-4 ${positionClass} flex gap-4 z-[var(--z-chat)]`}
        style={{ 
          transformOrigin: position === 'bottom-right' ? 'bottom right' : 'bottom left'
        }}
        animate={{ 
          scale: isOverflowing ? scale : 1,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        ref={containerRef}
      >
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: position === 'bottom-right' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: position === 'bottom-right' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <ChatSidebar />
            </motion.div>
          )}
        </AnimatePresence>
        
        <ChatContainerComponent
          scrollRef={scrollRef}
          isEditorPage={isEditorPage}
        />
      </motion.div>
    </DndContext>
  );
}

export default ChatContainer;
