import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { useMessages } from '@/hooks/useMessages';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const DraggableChat = () => {
  const CHAT_WIDTH = 350;
  const CHAT_HEIGHT = 500;
  const MARGIN = 32;

  const { currentSessionId, sessions, switchSession, createSession } = useSessionManager();
  const { position, setPosition, resetPosition } = useWindowPosition({
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
    margin: MARGIN,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTacked, setIsTacked] = useState(true);
  const { toast } = useToast();

  const {
    messages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(currentSessionId, isMinimized);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    if (isTacked) {
      setIsTacked(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    if (!isTacked) {
      const { delta } = event;
      setPosition((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    toast({
      title: "Chat closed",
      description: "You can reopen the chat from the menu",
    });
  };

  const handleTackToggle = () => {
    setIsTacked(!isTacked);
    if (!isTacked) {
      resetPosition();
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleNewSession = async () => {
    const newSessionId = await createSession();
    toast({
      title: "New chat session created",
      description: "You can switch between sessions using the menu",
    });
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-end px-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewSession}
          >
            New Session
          </Button>
          {sessions.map((session) => (
            <Button
              key={session.id}
              variant={session.id === currentSessionId ? "default" : "outline"}
              size="sm"
              onClick={() => handleSwitchSession(session.id)}
            >
              {session.id.slice(0, 4)}
            </Button>
          ))}
        </div>
        <ChatWindow
          position={position}
          isMinimized={isMinimized}
          messages={messages}
          isLoading={isLoading}
          onMinimize={handleMinimize}
          onClose={handleClose}
          isDragging={isDragging}
          isTacked={isTacked}
          onTackToggle={handleTackToggle}
          dimensions={{ width: CHAT_WIDTH, height: CHAT_HEIGHT }}
          hasMoreMessages={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={handleLoadMore}
        />
      </div>
    </ChatDragContext>
  );
};