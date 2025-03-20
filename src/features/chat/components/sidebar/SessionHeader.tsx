import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface SessionHeaderProps {
  onNewSession: () => void;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ onNewSession }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">Chat Sessions</h2>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNewSession}
        title="New Chat Session"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
