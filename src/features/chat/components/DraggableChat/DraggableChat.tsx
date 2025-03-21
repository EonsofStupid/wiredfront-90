
import React, { useEffect, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { useViewportAwareness } from "../../hooks/useViewportAwareness";
import { logger } from "../../services/LoggingService";
import { useChatLayoutStore } from "@/stores/chat/chatLayoutStore";
import ChatContainer from "./ChatContainer";
import ChatSidebar from "./ChatSidebar";
import { ChatToggleButton } from "./ChatToggleButton";
import { IconStack } from "../IconStack";
import "../../styles/chat.css";

export function DraggableChat() {
  const {
    isOpen,
    toggleOpen,
    isMinimized,
    showSidebar,
    scale,
    docked,
    position,
    setPosition
  } = useChatLayoutStore();

  const { containerRef, isOverflowing } = useViewportAwareness();

  // Load position from localStorage on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('chatPosition');
    if (savedPosition) {
      try {
        const positionData = JSON.parse(savedPosition);
        if (positionData) {
          setPosition(positionData);
        }
      } catch (error) {
        logger.error('Failed to parse saved chat position', { error });
      }
    }
  }, [setPosition]);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatPosition', JSON.stringify(position));
  }, [position]);

  // Log significant chat state changes
  useEffect(() => {
    logger.info('Chat state updated', {
      isOpen,
      isMinimized,
      showSidebar,
      scale,
      isOverflowing
    });
  }, [isOpen, isMinimized, showSidebar, scale, isOverflowing]);

  if (!isOpen) {
    return <ChatToggleButton onClick={toggleOpen} />;
  }

  // Determine position class based on position state
  const dockPosition = position?.x > window.innerWidth / 2 ? 'bottom-right' : 'bottom-left';

  return (
    <DndContext>
      <motion.div
        className="fixed bottom-4 flex gap-4 z-[var(--z-chat)]"
        style={{
          transformOrigin: dockPosition === 'bottom-right' ? 'bottom right' : 'bottom left',
          right: dockPosition === 'bottom-right' ? '1rem' : 'auto',
          left: dockPosition === 'bottom-left' ? '1rem' : 'auto'
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
              initial={{ opacity: 0, x: dockPosition === 'bottom-right' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dockPosition === 'bottom-right' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="chat-sidebar-container"
            >
              <ChatSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add IconStack component */}
        <IconStack position={dockPosition === 'bottom-right' ? 'right' : 'left'} />
        
        <ChatContainer dockPosition={dockPosition} />
      </motion.div>
    </DndContext>
  );
}

export default DraggableChat;
