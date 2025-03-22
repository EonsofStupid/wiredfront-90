
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatButton } from "./ui/ChatButton";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { ChatInputArea } from "./ChatInputArea";
import { cn } from "@/lib/utils";

export function DraggableChat() {
  const {
    isOpen,
    toggleOpen,
    isMinimized,
    showSidebar,
    scale,
    docked,
    position,
    setPosition,
    currentMode
  } = useChat();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
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
        console.error('Failed to parse saved chat position', { error });
      }
    }
  }, [setPosition]);

  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatPosition', JSON.stringify(position));
  }, [position]);

  if (!isOpen) {
    return <ChatButton position={position} scale={scale} onClick={toggleOpen} />;
  }

  // Determine position class based on position state
  const dockPosition = position?.x > window.innerWidth / 2 ? 'bottom-right' : 'bottom-left';

  return (
    <div ref={containerRef}>
      <motion.div
        className={cn(
          "fixed z-50 flex gap-4",
          docked ? `bottom-4 ${dockPosition === 'bottom-right' ? 'right-4' : 'left-4'}` : ''
        )}
        style={{
          transformOrigin: dockPosition === 'bottom-right' ? 'bottom right' : 'bottom left',
          transform: `scale(${scale})`,
        }}
        animate={{
          scale: scale,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <div
          className={cn(
            "chat-container relative w-[400px] h-[600px]",
            "bg-black/80 backdrop-blur-md border border-purple-500/50",
            "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
            "flex flex-col rounded-lg overflow-hidden",
            !docked && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <ChatHeader />

          {!isMinimized && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <ChatContent />
            </div>
          )}

          {!isMinimized && <ChatInputArea />}
        </div>
      </motion.div>
    </div>
  );
}

export default DraggableChat;
