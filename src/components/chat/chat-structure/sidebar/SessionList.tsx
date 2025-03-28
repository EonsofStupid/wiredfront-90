
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface SessionItem {
  id: string;
  lastAccessed: Date;
  isActive: boolean;
}

interface SessionListProps {
  sessions: SessionItem[];
  onSelectSession: (id: string) => void;
}

export const SessionList = ({ sessions, onSelectSession }: SessionListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">No sessions available</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto h-full">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`p-2 m-2 rounded-lg cursor-pointer transition-colors ${
            session.isActive
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted/50'
          }`}
          onClick={() => onSelectSession(session.id)}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm truncate">Chat {session.id.slice(0, 8)}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(session.lastAccessed, { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
