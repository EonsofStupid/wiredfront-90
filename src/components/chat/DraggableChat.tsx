
import React, { useState, useRef, useEffect } from "react";
import { X, Minus, MessageSquare, CodeIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useMessageStore } from "./messaging/MessageManager";
import { useChat } from "./ChatProvider";
import { useChatMode } from "./providers/ChatModeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageModule } from "./modules/MessageModule";
import { RAGModule } from "./modules/RAGModule";
import { GitHubSyncModule } from "./modules/GitHubSyncModule";
import { NotificationsModule } from "./modules/NotificationsModule";
import { ChatInputModule } from "./modules/ChatInputModule";
import { ModeSwitchModule } from "./modules/ModeSwitchModule";
import { ChatSidebar } from "./ChatSidebar";
import { toast } from "sonner";

export function DraggableChat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { currentSessionId } = useMessageStore();
  const { isOpen, toggleChat } = useChat();
  const { mode } = useChatMode();
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "chat-window",
  });

  const adjustedTransform = transform ? {
    x: transform.x,
    y: 0,
  } : undefined;

  const style = adjustedTransform ? {
    transform: `translate3d(${adjustedTransform.x}px, ${adjustedTransform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [useMessageStore().messages]);

  useEffect(() => {
    if (!chatRef.current) return;

    const updatePosition = () => {
      if (!chatRef.current) return;
      const rect = chatRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      if (rect.right > viewportWidth) {
        const overflow = rect.right - viewportWidth;
        chatRef.current.style.transform = `translate3d(${-overflow}px, 0, 0)`;
      }
      if (rect.left < 0) {
        chatRef.current.style.transform = `translate3d(0, 0, 0)`;
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg z-[var(--z-chat)] glass-card neon-glow hover:scale-105 transition-transform duration-200"
      >
        {mode === 'default' ? (
          <CodeIcon className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-4 z-[var(--z-chat)]">
      {showSidebar && <ChatSidebar />}
      
      <div 
        ref={(node) => {
          setNodeRef(node);
          if (chatRef) {
            chatRef.current = node;
          }
        }}
        style={style}
        {...attributes}
        {...listeners}
        className="w-[400px]"
      >
        <Card className="shadow-xl glass-card neon-border">
          <CardHeader className="p-4 cursor-move flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <span className="font-semibold">
                {mode === 'default' ? 'Code Generation' : 'Planning & Research'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-4">
                <div className="mb-4">
                  <ModeSwitchModule />
                </div>
                
                {/* Message display area */}
                <MessageModule scrollRef={scrollRef} />
                
                {/* Mode-specific modules */}
                {mode === 'chat-only' && (
                  <div className="mt-4 space-y-2">
                    <RAGModule />
                  </div>
                )}
                
                {mode === 'default' && (
                  <div className="mt-4 space-y-2">
                    <GitHubSyncModule />
                    <NotificationsModule />
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-4 border-t">
                <ChatInputModule />
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DraggableChat;
