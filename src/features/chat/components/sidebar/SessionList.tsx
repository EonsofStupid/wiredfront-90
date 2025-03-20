import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import type { ChatSession } from '../../types';
import { SessionItem } from './SessionItem';
import { SessionSkeleton } from './SessionSkeleton';

interface SessionListProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  onSelectSession: (session: ChatSession) => void;
  onEditSession: (session: ChatSession) => void;
  onDeleteSession: (session: ChatSession) => void;
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentSessionId,
  isLoading,
  onSelectSession,
  onEditSession,
  onDeleteSession,
}) => {
  if (isLoading) {
    return <SessionSkeleton />;
  }

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No chat sessions yet.</p>
        <p className="text-sm">Start a new chat to begin.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-1 p-2">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === currentSessionId}
            onSelect={onSelectSession}
            onEdit={onEditSession}
            onDelete={onDeleteSession}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
