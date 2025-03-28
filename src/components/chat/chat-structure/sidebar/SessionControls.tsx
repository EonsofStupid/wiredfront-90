
import React from 'react';

interface SessionControlsProps {
  children: React.ReactNode;
}

export const SessionControls = ({ children }: SessionControlsProps) => {
  return (
    <div className="border-t p-2">
      {children}
    </div>
  );
};
