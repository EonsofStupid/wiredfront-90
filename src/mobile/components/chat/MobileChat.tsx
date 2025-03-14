
import React from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobileChat } from "../../hooks/useMobileChat";
import { MobileChatInput } from "./MobileChatInput";
import { MobileChatMessages } from "./MobileChatMessages";

/**
 * Mobile-optimized chat interface with sliding drawer functionality
 */
export const MobileChat = () => {
  const { isOpen, isMinimized, closeChat, toggleMinimize } = useMobileChat();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-x-0 z-[100] bg-dark-lighter/95 backdrop-blur-lg border-t border-neon-blue/30",
        "transition-all duration-300 ease-out",
        isMinimized 
          ? "h-12 bottom-16" 
          : "bottom-16 h-[60vh]"
      )}
    >
      <div className="flex items-center justify-between h-12 px-4 border-b border-neon-blue/20">
        <h2 className="text-sm font-medium text-neon-blue">AI Assistant</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neon-pink hover:text-neon-blue"
            onClick={toggleMinimize}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neon-pink hover:text-neon-blue"
            onClick={closeChat}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex flex-col h-[calc(60vh-3rem)]">
          <MobileChatMessages />
          <MobileChatInput />
        </div>
      )}
    </div>
  );
};
