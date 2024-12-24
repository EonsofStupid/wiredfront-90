import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { useMessages } from '@/hooks/useMessages';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { toast } from 'sonner';
import { ChatSessionControls } from './ChatSessionControls';
import { useChatStore } from '@/stores/chat/store';
import { useUIStore } from '@/stores/ui/store';
import { ChatContainer } from './ChatContainer';
import { useAPISwitch } from '@/hooks/chat/useAPISwitch';

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

  const { currentAPI, handleSwitchAPI } = useAPISwitch();
  const { floating: zIndexValue } = useUIStore((state) => state.zIndex);
  const initializingRef = useRef(false);
  const positionUpdateTimeoutRef = useRef<NodeJS.Timeout>();

  const { position, setPosition, resetPosition } = useWindowPosition({
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
    margin: MARGIN,
  });

  const [isDragging, setIsDragging] = useState(false);

  const currentSession = useMemo(() => 
    currentSessionId ? sessions[currentSessionId] : null,
    [currentSessionId, sessions]
  );

  const {
    messages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    addOptimisticMessage
  } = useMessages(currentSessionId, currentSession?.isMinimized ?? false);

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentSessionId && !initializingRef.current) {
        initializingRef.current = true;
        try {
          await createSession();
        } catch (error) {
          console.error('Failed to initialize chat:', error);
          toast.error('Failed to initialize chat session', { id: 'chat-init-error' });
        }
        initializingRef.current = false;
      }
    };

    initializeChat();
  }, [currentSessionId, createSession]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
    if (currentSession?.isTacked) {
      updateSession(currentSessionId!, { isTacked: false });
    }
  }, [currentSession?.isTacked, currentSessionId, updateSession]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setIsDragging(false);
    if (currentSessionId && !currentSession?.isTacked) {
      const { delta } = event;
      const newPosition = {
        x: position.x + delta.x,
        y: position.y + delta.y,
      };

      // Debounce position updates
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }

      setPosition(newPosition);
      positionUpdateTimeoutRef.current = setTimeout(() => {
        updateSession(currentSessionId, { position: newPosition });
      }, 100);
    }
  }, [currentSession?.isTacked, currentSessionId, position.x, position.y, setPosition, updateSession]);

  const handleMinimize = useCallback(() => {
    if (currentSessionId && currentSession) {
      updateSession(currentSessionId, { 
        isMinimized: !currentSession.isMinimized 
      });
    }
  }, [currentSession, currentSessionId, updateSession]);

  const handleClose = useCallback(() => {
    if (currentSessionId) {
      updateSession(currentSessionId, { isMinimized: true });
      toast.info("Chat minimized - You can restore the chat from the AI button", {
        id: 'chat-minimized'
      });
    }
  }, [currentSessionId, updateSession]);

  const handleTackToggle = useCallback(() => {
    if (currentSessionId && currentSession) {
      const newIsTacked = !currentSession.isTacked;
      updateSession(currentSessionId, { isTacked: newIsTacked });
      if (newIsTacked) {
        resetPosition();
      }
    }
  }, [currentSession, currentSessionId, resetPosition, updateSession]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleNewSession = useCallback(() => {
    createSession();
    toast.success("New chat session created", { id: 'new-session' });
  }, [createSession]);

  const handleCloseSession = useCallback((sessionId: string) => {
    if (Object.keys(sessions).length > 1) {
      removeSession(sessionId);
      toast.success("Chat session closed", { id: 'session-closed' });
    } else {
      toast.error("You must have at least one active session", { id: 'session-error' });
    }
  }, [removeSession, sessions]);

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      await addOptimisticMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message. Please try again.", { id: 'send-error' });
    }
  }, [addOptimisticMessage]);

  useEffect(() => {
    return () => {
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }
    };
  }, []);

  if (!currentSession) {
    return null;
  }

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2" style={{ zIndex: zIndexValue }}>
        <ChatSessionControls
          sessions={Object.values(sessions)}
          currentSessionId={currentSessionId!}
          onNewSession={handleNewSession}
          onSwitchSession={switchSession}
          onCloseSession={handleCloseSession}
        />
        <ChatWindow
          position={currentSession?.position || position}
          isMinimized={currentSession?.isMinimized || false}
          messages={messages}
          isLoading={isLoading}
          onMinimize={handleMinimize}
          onClose={handleClose}
          isDragging={isDragging}
          isTacked={currentSession?.isTacked || false}
          onTackToggle={handleTackToggle}
          dimensions={{ width: CHAT_WIDTH, height: CHAT_HEIGHT }}
          hasMoreMessages={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={handleLoadMore}
          onSendMessage={handleSendMessage}
          onSwitchAPI={handleSwitchAPI}
          currentAPI={currentAPI}
          connectionState={connectionState}
        />
        {currentSessionId && <ChatContainer sessionId={currentSessionId} />}
      </div>
    </ChatDragContext>
  );
};