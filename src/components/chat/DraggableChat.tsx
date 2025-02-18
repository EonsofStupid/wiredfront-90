import React, { useState, useRef, useEffect } from "react";
import { X, Minus, MessageSquare } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { useMessageStore } from "./messaging/MessageManager";
import { useChat } from "./ChatProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DraggableChat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, addMessage } = useMessageStore();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      addMessage({
        content: message,
        role: 'user',
        timestamp: new Date().toISOString()
      });
      setMessage("");
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
        className="fixed bottom-4 right-4 p-4 rounded-full shadow-lg z-[var(--z-chat)]"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
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
      className="fixed bottom-4 right-4 w-[400px] z-[var(--z-chat)]"
    >
      <Card className="shadow-xl">
        <CardHeader className="p-4 cursor-move flex flex-row justify-between items-center">
          <span className="font-semibold">Chat</span>
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
                      key={index}
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
                />
                <Button type="submit">Send</Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default DraggableChat;
