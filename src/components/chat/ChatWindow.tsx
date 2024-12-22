import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ConnectionState } from '@/types/websocket';
import { DebugMetrics } from '../debug/DebugPanel/DebugMetrics';
import { ConnectionStatus } from '../debug/DebugPanel/ConnectionStatus';

interface ChatWindowProps {
  position: { x: number; y: number };
  isMinimized: boolean;
  messages: any[];
  isLoading: boolean;
  onMinimize: () => void;
  onClose: () => void;
  isDragging: boolean;
  isTacked: boolean;
  onTackToggle: () => void;
  dimensions: { width: number; height: number };
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onSendMessage: (content: string) => void;
  onSwitchAPI?: (provider: string) => void;
  currentAPI?: string;
  connectionState?: ConnectionState;
}

export const ChatWindow = ({ 
  position, 
  isMinimized, 
  messages, 
  isLoading,
  onMinimize, 
  onClose,
  isDragging,
  isTacked,
  onTackToggle,
  dimensions,
  hasMoreMessages,
  isLoadingMore,
  onLoadMore,
  onSendMessage,
  onSwitchAPI,
  currentAPI,
  connectionState
}: ChatWindowProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'chat-window',
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      onLoadMore();
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    position: 'fixed' as const,
    left: isTacked ? 'auto' : position.x,
    right: isTacked ? '32px' : 'auto',
    bottom: isTacked ? '48px' : 'auto',
    top: isTacked ? 'auto' : position.y,
    width: dimensions.width,
    height: isMinimized ? '50px' : dimensions.height,
    transition: 'height 0.3s ease',
    zIndex: isDragging ? 9999 : 1000,
    border: isDragging ? `2px solid #baff0a` : undefined,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="glass-card flex flex-col"
      >
        <ChatHeader
          onMinimize={onMinimize}
          onClose={onClose}
          onTackToggle={onTackToggle}
          isTacked={isTacked}
          isDragging={isDragging}
          dragHandleProps={{ ...attributes, ...listeners }}
          currentAPI={currentAPI}
          connectionState={connectionState}
        />

        {!isMinimized && (
          <>
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMoreMessages={hasMoreMessages}
              onLoadMore={onLoadMore}
              onScroll={handleScroll}
            />
            <ChatInput 
              onSendMessage={onSendMessage}
              onSwitchAPI={onSwitchAPI}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <DebugMetrics />
      <ConnectionStatus />
    </>
  );
};
