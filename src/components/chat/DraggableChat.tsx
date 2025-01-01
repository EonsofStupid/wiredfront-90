import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useWindowPosition } from '@/hooks/useWindowPosition';
import { useMessages } from '@/services/chat/hooks/useMessages';
import { ChatWindow } from './ChatWindow';
import { ChatDragContext } from './ChatDragContext';
import { ChatSessionControls } from './ChatSessionControls';
import { useChatStore } from '@/stores/chat/store';
import { useUIStore } from '@/stores/ui/store';
import { ChatContainer } from './ChatContainer';
import { useAPISwitch } from '@/services/chat/hooks/useAPISwitch';
import { useMessageStatus } from '@/services/chat/hooks/useMessageStatus';
import { ChatSessionManager } from './ChatSessionManager';
import { Message } from '@/types/chat';

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

  const { position, setPosition, resetPosition } = useWindowPosition({
    width: CHAT_WIDTH,
    height: CHAT_HEIGHT,
    margin: MARGIN,
  });

  const [isDragging, setIsDragging] = useState(false);
  const { updateMessageStatus } = useMessageStatus(currentSessionId || '');

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
        } finally {
          initializingRef.current = false;
        }
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
      setPosition({
        x: position.x + delta.x,
        y: position.y + delta.y,
      });
    }
  }, [currentSession?.isTacked, currentSessionId, position.x, position.y, setPosition]);

  const handleSendMessage = useCallback(async (content: string) => {
    try {
      const message = await addOptimisticMessage(content);
      if (message) {
        await updateMessageStatus(message.id, 'processing');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [addOptimisticMessage, updateMessageStatus]);

  if (!currentSession) {
    return null;
  }

  return (
    <ChatDragContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2" style={{ zIndex: zIndexValue }}>
        <ChatSessionControls
          sessions={Object.values(sessions)}
          currentSessionId={currentSessionId!}
          onNewSession={createSession}
          onSwitchSession={switchSession}
          onCloseSession={removeSession}
        />
        <ChatWindow
          position={currentSession?.position || position}
          isMinimized={currentSession?.isMinimized || false}
          messages={messages}
          isLoading={isLoading}
          onMinimize={() => updateSession(currentSessionId!, { 
            isMinimized: !currentSession.isMinimized 
          })}
          onClose={() => updateSession(currentSessionId!, { isMinimized: true })}
          isDragging={isDragging}
          isTacked={currentSession?.isTacked || false}
          onTackToggle={() => {
            updateSession(currentSessionId!, { 
              isTacked: !currentSession.isTacked 
            });
            if (!currentSession.isTacked) {
              resetPosition();
            }
          }}
          dimensions={{ width: CHAT_WIDTH, height: CHAT_HEIGHT }}
          hasMoreMessages={hasNextPage}
          isLoadingMore={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          onSendMessage={handleSendMessage}
          onSwitchAPI={handleSwitchAPI}
          currentAPI={currentAPI}
          connectionState={connectionState}
        />
        <ChatSessionManager
          onNewSession={createSession}
          onSwitchSession={switchSession}
          onCloseSession={removeSession}
        />
        {currentSessionId && <ChatContainer sessionId={currentSessionId} />}
      </div>
    </ChatDragContext>
  );
};