
import React from 'react';

interface ChatSessionControlsProps {
  children: React.ReactNode;
}

export const SessionControls = ({ children }: ChatSessionControlsProps) => {
  return (
    <div className="border-t p-2">
      {children}
    </div>
  );
};
