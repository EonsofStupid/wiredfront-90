import { useChatLayoutStore } from '@/features/chat/store/chatLayoutStore';
import { useChatModeStore } from '@/features/chat/store/chatModeStore';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import { ChatContent } from '../ChatContent/ChatContent';
import { ChatInputArea } from '../ChatInputArea/ChatInputArea';
import ChatHeader from './ChatHeader';

interface ChatContainerProps {
  className?: string;
  dockPosition?: 'bottom-right' | 'bottom-left';
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  className,
  dockPosition = 'bottom-right'
}) => {
  const { isMinimized, docked } = useChatLayoutStore();
  const { currentMode } = useChatModeStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine position class based on dockPosition
  const positionClass = dockPosition === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <div
      className={cn(
        "chat-container relative w-[400px] h-[600px]",
        "bg-black/80 backdrop-blur-md border border-purple-500/50",
        "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        "flex flex-col rounded-lg overflow-hidden",
        !docked && 'cursor-grab active:cursor-grabbing',
        docked && `fixed bottom-4 ${positionClass}`,
        className
      )}
    >
      <ChatHeader />

      {!isMinimized && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatContent />
          <div ref={messagesEndRef} />
        </div>
      )}

      {!isMinimized && <ChatInputArea />}
    </div>
  );
};

export default ChatContainer;
