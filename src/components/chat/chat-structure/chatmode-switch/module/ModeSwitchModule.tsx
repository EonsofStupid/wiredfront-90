import React from 'react';
import { ChatProvider } from '@chat/store/types/chat-store-types';
import { useChatStore } from '@/components/chat/store/chatStore';

export function ModeSwitchModule() {
  const { isEditorPage } = useChatMode();
  
  // We no longer need the mode switch button as modes are determined by routes
  return null;
}
