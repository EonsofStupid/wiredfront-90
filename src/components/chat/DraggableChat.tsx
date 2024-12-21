import { useState } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { useMessages } from '@/hooks/useMessages';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { useToast } from "@/components/ui/use-toast";
import { ChatSessionControls } from './ChatSessionControls';

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
    addOptimisticMessage
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

  const handleSendMessage = async (content: string) => {
    try {
      await addOptimisticMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (error) {
    console.error('Chat error:', error);
  }

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        <ChatSessionControls
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewSession={handleNewSession}
          onSwitchSession={switchSession}
        />
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
          onSendMessage={handleSendMessage}
        />
      </div>
    </ChatDragContext>
  );
};