
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionItem } from "./SessionItem";

interface SessionListProps {
  sessions: Array<{
    id: string;
    lastAccessed: Date;
    isActive: boolean;
  }>;
  onSelectSession: (id: string) => void;
}

export const SessionList = ({ sessions, onSelectSession }: SessionListProps) => {
  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-1">
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            id={session.id}
            lastAccessed={session.lastAccessed}
            isActive={session.isActive}
            onSelect={onSelectSession}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
