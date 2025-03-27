import React, { RefObject } from 'react';
import { useChatStore } from '@chat/store/chatStore';
import { ChatHeaderTopNav } from '@chat/chat-structure/chatheadertopnav';
import { ChatInput } from '@chat/chat-structure/chatinput';
import { ChatMessages } from '@chat/chat-structure/messages;
import styles from '@chat/styles/chat.module.css';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  scrollRef: RefObject<HTMLDivElement>;
  isEditorPage: boolean;
}

export function ChatContainer({ scrollRef, isEditorPage }: ChatContainerProps) {
  const { isMinimized, neonEnabled, glassEnabled } = useChatStore();

  return (
    <div
      className={cn(
        styles.chatContainer,
        {
          [styles.minimized]: isMinimized,
          [styles.neonEnabled]: neonEnabled,
          [styles.glassEnabled]: glassEnabled
        }
      )}
    >
      <ChatHeaderTopNav />
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ChatMessages scrollRef={scrollRef} />
      </div>
      <ChatInput isEditorPage={isEditorPage} />
    </div>
  );
} 