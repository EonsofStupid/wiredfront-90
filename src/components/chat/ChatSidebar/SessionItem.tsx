
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { SessionModeBadge } from './SessionModeBadge';

interface SessionItemProps {
  id: string;
  title?: string;
  lastAccessed: Date;
  isActive: boolean;
  onSelect: (id: string) => void;
  provider?: string;
  messageCount?: number;
  mode?: ChatMode;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  id,
  title,
  lastAccessed,
  isActive,
  onSelect,
  provider,
  messageCount = 0,
  mode = 'chat'
}) => {
  // Format the session title
  const sessionTitle = title || `Chat Session ${id.slice(0, 4)}`;
  
  // Format the time ago
  const timeAgo = formatDistanceToNow(new Date(lastAccessed), { addSuffix: true });

  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all duration-200",
        "border border-transparent hover:border-neon-blue/30",
        "hover:bg-white/5",
        isActive 
          ? "bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border-neon-blue/30" 
          : "bg-transparent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue"
      )}
      data-session-id={id}
      aria-selected={isActive}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium truncate max-w-[150px]">{sessionTitle}</div>
        <SessionModeBadge mode={mode} className="ml-1 shrink-0" />
      </div>
      
      <div className="flex justify-between items-center text-xs opacity-60">
        <span>{timeAgo}</span>
        {messageCount > 0 && (
          <span className="bg-white/10 px-1.5 rounded-full">{messageCount} msg</span>
        )}
      </div>
    </button>
  );
};
