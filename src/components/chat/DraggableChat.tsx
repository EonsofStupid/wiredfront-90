
import React, { useRef, useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { ChatSidebar } from "./ChatSidebar";
import ChatToggleButton from "./components/ChatToggleButton";
import DraggableChatContainer from "./components/DraggableChatContainer";
import { useViewportAwareness } from "./hooks/useViewportAwareness";
import { useChatStore } from "./store/chatStore";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";
import { ChatModeDialog } from "./features/ModeSwitch/ChatModeDialog";
import { ChatMode } from "@/integrations/supabase/types/enums";
import "./styles/index.css";
import "./styles/cyber-theme.css";

export function DraggableChat() {
  const { 
    isOpen, 
    toggleChat, 
    position, 
    isMinimized, 
    showSidebar, 
    scale,
    docked,
    setCurrentMode,
    updateCurrentProvider,
    availableProviders
  } = useChatStore();
  
  const { containerRef, isOverflowing } = useViewportAwareness();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const [modeDialogOpen, setModeDialogOpen] = useState(false);

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

  // Handle selecting a mode from the dialog
  const handleModeSelect = (mode: ChatMode, providerId: string) => {
    setCurrentMode(mode);
    
    // Find and update current provider
    const provider = availableProviders.find(p => p.id === providerId);
    if (provider) {
      updateCurrentProvider(provider);
    }
    
    // Ensure chat is open when changing modes
    if (!isOpen) {
      toggleChat();
    }
  };

  if (!isOpen) {
    return (
      <>
        <div className="fixed bottom-4 right-4 z-50">
          <ChatToggleButton onClick={toggleChat} />
        </div>
        <ChatModeDialog
          open={modeDialogOpen}
          onOpenChange={setModeDialogOpen}
          onModeSelect={handleModeSelect}
        />
      </>
    );
  }

  // Determine position class based on position state
  const positionClass = typeof position === 'string' && position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <DndContext>
      <motion.div 
        className={`fixed bottom-4 ${positionClass} flex gap-4 chat-component z-[var(--z-chat)]`}
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
              className="chat-sidebar-container"
            >
              <ChatSidebar />
            </motion.div>
          )}
        </AnimatePresence>
        
        <DraggableChatContainer
          scrollRef={scrollRef}
          isEditorPage={isEditorPage}
        />
      </motion.div>
    </DndContext>
  );
}

export default DraggableChat;
