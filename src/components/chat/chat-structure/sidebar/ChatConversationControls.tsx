
import React from 'react';

interface ChatConversationControlsProps {
  children: React.ReactNode;
}

export const ChatConversationControls = ({ children }: ChatConversationControlsProps) => {
  return (
    <div className="border-t p-2">
      {children}
    </div>
  );
};
