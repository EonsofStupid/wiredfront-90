
import React, { useRef, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { ChatSidebar } from "./ChatSidebar";
import ChatToggleButton from "./components/ChatToggleButton";
import DraggableChatContainer from "./components/DraggableChatContainer";
import { useViewportAwareness } from "./hooks/useViewportAwareness";
import { useChatStore } from "./store/chatStore";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";
import "./styles/index.css";

export function DraggableChat() {
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
  const isEditorPage = location.pathname === '/editor';

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

  if (!isOpen) {
    return <ChatToggleButton onClick={toggleChat} />;
  }

  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <DndContext>
      <motion.div 
        className={`fixed bottom-4 ${positionClass} flex gap-4 chat-component`}
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
