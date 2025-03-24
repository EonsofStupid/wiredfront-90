
import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface SessionHeaderProps {
  sessionCount: number;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ sessionCount }) => {
  return (
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MessageSquareText className="h-5 w-5 text-neon-blue" />
        <h3 className="font-medium">Chat Sessions</h3>
      </div>
      <div className="bg-white/10 rounded-full px-2 py-0.5 text-xs">
        {sessionCount}
      </div>
    </div>
  );
};
