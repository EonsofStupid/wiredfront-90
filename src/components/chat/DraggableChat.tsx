
import React, { useState, useRef, useEffect } from "react";
import { X, Minus, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useMessageStore } from "./messaging/MessageManager";
import { useChat } from "./ChatProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatSidebar } from "./ChatSidebar";
import { toast } from "sonner";

export function DraggableChat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, addMessage, currentSessionId, isProcessing } = useMessageStore();
  const { isOpen, toggleChat } = useChat();
  const chatRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionId) {
      toast.error('No active chat session');
      return;
    }
    
    if (message.trim()) {
      try {
        await addMessage({
          content: message.trim(),
          role: 'user',
          sessionId: currentSessionId
        });
        setMessage("");
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
      }
    }
  };

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
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg z-[var(--z-chat)] glass-card neon-glow"
      >
        <MessageSquare className="h-6 w-6" />
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
              <span className="font-semibold">Chat</span>
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
                <ScrollArea className="h-[300px] w-full pr-4">
                  <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => (
                      <div
                        key={msg.id || index}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-4">
                <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button type="submit" disabled={isProcessing}>
                    {isProcessing ? 'Sending...' : 'Send'}
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DraggableChat;
