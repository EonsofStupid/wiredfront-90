
import React from 'react';

interface ChatConversationControlsProps {
  children: React.ReactNode;
}

export function ChatConversationControls({ children }: ChatConversationControlsProps) {
  return (
    <div className="border-t border-border p-2">
      {children}
    </div>
  );
}
