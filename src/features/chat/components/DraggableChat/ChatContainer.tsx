
import React, { useRef } from 'react';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { cn } from '@/lib/utils';
import ChatHeader from './ChatHeader';
import ChatContent from '../ChatContent';
import ChatInputArea from '../ChatInputArea';

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
        "chat-container cyber-bg",
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
