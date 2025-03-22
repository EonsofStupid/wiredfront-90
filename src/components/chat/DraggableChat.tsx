
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ChatContent } from "./ChatContent";
import { ChatHeader } from "./ChatHeader";
import { ChatInputArea } from "./ChatInputArea";
import { ChatButton } from "./ui/ChatButton";
import "./styles/chat-variables.css";

export function DraggableChat() {
  const {
    isOpen,
    toggleOpen,
    isMinimized,
    docked,
    position,
    scale,
    setPosition
  } = useChat();

  // Save position to localStorage when it changes is now handled by Jotai

  const togglePosition = () => {
    setPosition({
      x: position.x > window.innerWidth / 2 ? 0 : window.innerWidth,
      y: position.y
    });
  };

  if (!isOpen) {
    return <ChatButton position={position} scale={scale} onClick={toggleOpen} />;
  }

  // Determine position class based on position state
  const dockPosition = position.x > window.innerWidth / 2 ? 'bottom-right' : 'bottom-left';

  return (
    <div>
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
          <ChatHeader onPositionToggle={togglePosition} />

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
