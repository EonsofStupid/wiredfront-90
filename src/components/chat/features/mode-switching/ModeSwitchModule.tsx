
import React from 'react';
import { useChatMode } from "../../providers/ChatModeProvider";

export function ModeSwitchModule() {
  const { isEditorPage } = useChatMode();
  
  // We no longer need the mode switch button as modes are determined by routes
  return null;
}
