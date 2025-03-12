
import React from 'react';
import { useChat } from "@/features/chat/providers/ChatProvider";

export function ModeSwitchModule() {
  const { isEditorPage } = useChat();
  
  // We no longer need the mode switch button as modes are determined by routes
  return null;
}
