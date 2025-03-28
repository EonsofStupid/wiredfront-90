
import React from "react";
import { DndContext } from "@dnd-kit/core";
import { ChatHeader } from "../header/ChatHeader";
import { ChatContent } from "../content/ChatContent";
import { useChatWindowResize } from "../../hooks/useChatWindowResize";
import { useChatStore } from "../../store/chatStore";
import { ChatMode } from "@/types/chat/enums";
import { cn } from "@/lib/utils";
import { useTokenStore } from "../../store/token";

interface ChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

export function ChatContainer({ scrollRef, isEditorPage }: ChatContainerProps) {
  const { isMinimized, currentMode } = useChatStore();
  const { balance } = useTokenStore();
  
  // Hook to handle window resize logic
  const { windowWidth, windowHeight, setWindowSize } = useChatWindowResize();
  
  // Calculate appropriate height based on chat mode and device
  const getHeight = () => {
    if (isMinimized) return "h-16"; // Minimized height
    
    // Handle mode-specific sizes
    if (currentMode === ChatMode.Dev) {
      return isEditorPage ? "h-[500px]" : "h-[600px]";
    } else if (currentMode === ChatMode.Image) {
      return "h-[650px]"; // Taller for image generation
    }
    
    // Default standard chat height
    return "h-[500px]";
  };
  
  // Only render header when in minimized state, otherwise render full container
  return (
    <DndContext>
      <div 
        className={cn(
          "w-[350px] rounded-lg glass-card neon-border overflow-hidden flex flex-col",
          getHeight(),
          balance <= 0 && "token-empty" // Add visual indicator for low tokens
        )}
        style={{
          width: `${windowWidth}px`,
          height: isMinimized ? undefined : `${windowHeight}px`
        }}
      >
        <ChatHeader 
          isMinimized={isMinimized} 
          onResize={setWindowSize}
        />
        
        <ChatContent 
          scrollRef={scrollRef} 
          isMinimized={isMinimized}
          isEditorPage={isEditorPage}
        />
      </div>
    </DndContext>
  );
}
