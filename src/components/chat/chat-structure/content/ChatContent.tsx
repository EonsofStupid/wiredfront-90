
import React from 'react';
import { MessageModule } from '../messages/MessageModule';
import { ChatInputModule } from '../input/ChatInputModule';
import { useChatStore } from '../../store/chatStore';
import { cn } from '@/lib/utils';

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
  isEditorPage: boolean;
}

export function ChatContent({ 
  scrollRef, 
  isMinimized,
  isEditorPage
}: ChatContentProps) {
  const { features } = useChatStore();
  
  // If minimized, render nothing
  if (isMinimized) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "flex flex-col flex-1 overflow-hidden",
        features.tokenEnforcement && "with-token-display"
      )}
    >
      <div className="flex-1 overflow-hidden">
        <MessageModule scrollRef={scrollRef} />
      </div>
      
      <ChatInputModule isEditorPage={isEditorPage} />
    </div>
  );
}
