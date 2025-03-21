
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useChatLayoutStore } from "@/stores/chat/layoutStore";
import { useViewportAwareness } from "../../hooks/useViewportAwareness";
import { ChatContent } from "../ChatContent";
import { ChatHeader } from "../ChatHeader";
import { ChatInputArea } from "../ChatInputArea";
import { ModeSelectionDialog } from "../ModeSelection/ModeSelectionDialog";

interface ChatContainerProps {
  className?: string;
  dockPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function ChatContainer({ 
  className, 
  dockPosition = 'bottom-right' 
}: ChatContainerProps) {
  const { 
    position, 
    setPosition, 
    scale, 
    isMinimized, 
    docked, 
  } = useChatLayoutStore();
  
  const [modeDialogOpen, setModeDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { containerRef } = useViewportAwareness();
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-container',
    disabled: docked
  });
  
  // Calculate transform style for dragging
  const style = transform && !docked
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})`,
      }
    : {
        transform: `translate3d(0, 0, 0) scale(${scale})`,
      };
  
  // Auto snap to edges when dragging
  useEffect(() => {
    if (!transform || docked) return;
    
    const threshold = 20; // pixels from edge
    const containerWidth = 400; // Approximate container width
    const containerHeight = 500; // Approximate container height
    
    const newX = position.x + transform.x;
    const newY = position.y + transform.y;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check if it's near an edge
    const isNearRightEdge = newX + containerWidth > viewportWidth - threshold;
    const isNearLeftEdge = newX < threshold;
    const isNearBottomEdge = newY + containerHeight > viewportHeight - threshold;
    const isNearTopEdge = newY < threshold;
    
    // Auto-snap to edges
    if (isNearRightEdge || isNearLeftEdge || isNearBottomEdge || isNearTopEdge) {
      const snappedX = isNearRightEdge 
        ? viewportWidth - containerWidth - 10 
        : isNearLeftEdge 
          ? 10 
          : position.x + transform.x;
      
      const snappedY = isNearBottomEdge
        ? viewportHeight - containerHeight - 10
        : isNearTopEdge
          ? 10
          : position.y + transform.y;
      
      setPosition({ x: snappedX, y: snappedY });
    } else {
      // Update position based on drag
      setPosition({ 
        x: position.x + transform.x, 
        y: position.y + transform.y 
      });
    }
  }, [transform, position, setPosition, docked]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isMinimized]);
  
  // Handle opening mode selector
  const handleOpenModeSelector = () => {
    setModeDialogOpen(true);
  };
  
  // Handle toggle sidebar
  const handleToggleSidebar = () => {
    useChatLayoutStore.getState().toggleSidebar();
  };
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...(docked ? {} : { ...listeners, ...attributes })}
      className={cn(
        "chat-container overflow-hidden flex flex-col cyber-bg",
        !docked && 'cursor-grab active:cursor-grabbing',
        className
      )}
    >
      <ChatHeader 
        onToggleSidebar={handleToggleSidebar}
        onOpenModeSelector={handleOpenModeSelector}
      />
      
      {!isMinimized && (
        <div className="flex-1 overflow-hidden flex flex-col" ref={containerRef}>
          <ChatContent className="flex-1" />
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {!isMinimized && (
        <ChatInputArea />
      )}
      
      <ModeSelectionDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
      />
    </div>
  );
}
