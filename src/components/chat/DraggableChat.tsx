import { useState, useEffect } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { useMessages } from '@/hooks/useMessages';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { useToast } from "@/components/ui/use-toast";
import { ChatSessionControls } from './ChatSessionControls';
import { useChatStore } from '@/stores/chat/store';
import { useUIStore } from '@/stores/ui/store';
import { ChatContainer } from './ChatContainer';

export const DraggableChat = () => {
  const CHAT_WIDTH = 414;
  const CHAT_HEIGHT = 500;
  const MARGIN = 32;

  const { 
    sessions,
    currentSessionId,
    createSession,
    switchSession,
    updateSession,
    removeSession,
    connectionState
  } = useChatStore();

  const zIndex = useUIStore((state) => state.zIndex);

  const { position, setPosition, resetPosition } = useWindowPosition({
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
    margin: MARGIN,
  });

  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const currentSession = currentSessionId ? sessions[currentSessionId] : null;

  const {
    messages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addOptimisticMessage
  } = useMessages(currentSessionId, currentSession?.isMinimized ?? false);

  // Initialize session if none exists
  useEffect(() => {
    if (!currentSessionId) {
      createSession();
    }
  }, [currentSessionId, createSession]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    if (currentSession?.isTacked) {
      updateSession(currentSessionId!, { isTacked: false });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    if (currentSessionId && !currentSession?.isTacked) {
      const { delta } = event;
      const newPosition = {
        x: position.x + delta.x,
        y: position.y + delta.y,
      };
      setPosition(newPosition);
      updateSession(currentSessionId, { position: newPosition });
    }
  };

  const handleMinimize = () => {
    if (currentSessionId && currentSession) {
      updateSession(currentSessionId, { 
        isMinimized: !currentSession.isMinimized 
      });
    }
  };

  const handleClose = () => {
    toast({
      title: "Chat minimized",
      description: "You can restore the chat from the AI button",
    });
    if (currentSessionId) {
      updateSession(currentSessionId, { isMinimized: true });
    }
  };

  const handleTackToggle = () => {
    if (currentSessionId && currentSession) {
      const newIsTacked = !currentSession.isTacked;
      updateSession(currentSessionId, { isTacked: newIsTacked });
      if (newIsTacked) {
        resetPosition();
      }
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleNewSession = () => {
    createSession();
    toast({
      title: "New chat session created",
      description: "You can switch between sessions using the menu",
    });
  };

  const handleCloseSession = (sessionId: string) => {
    if (Object.keys(sessions).length > 1) {
      removeSession(sessionId);
      toast({
        title: "Session closed",
        description: "Chat session has been closed",
      });
    } else {
      toast({
        title: "Cannot close session",
        description: "You must have at least one active session",
        variant: "destructive"
      });
    }
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

  if (!currentSession) return null;

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2" style={{ zIndex: zIndex.floating }}>
        <ChatSessionControls
          sessions={Object.values(sessions)}
          currentSessionId={currentSessionId!}
          onNewSession={handleNewSession}
          onSwitchSession={switchSession}
          onCloseSession={handleCloseSession}
        />
        <ChatWindow
          position={currentSession.position}
          isMinimized={currentSession.isMinimized}
          messages={messages}
          isLoading={isLoading}
          onMinimize={handleMinimize}
          onClose={handleClose}
          isDragging={isDragging}
          isTacked={currentSession.isTacked}
          onTackToggle={handleTackToggle}
          dimensions={{ width: CHAT_WIDTH, height: CHAT_HEIGHT }}
          hasMoreMessages={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={handleLoadMore}
          onSendMessage={handleSendMessage}
          connectionState={connectionState}
        />
        {currentSessionId && <ChatContainer sessionId={currentSessionId} />}
      </div>
    </ChatDragContext>
  );
};