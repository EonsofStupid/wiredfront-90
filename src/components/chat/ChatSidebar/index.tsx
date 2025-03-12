
import React from "react";
import { SessionList } from "./SessionList";
import { SessionControls } from "./SessionControls";
import { useSessionManager } from "@/hooks/useSessionManager";
import { Badge } from "@/components/ui/badge";

export const ChatSidebar = () => {
  const {
    sessions,
    currentSessionId,
    switchSession,
    createSession,
    cleanupInactiveSessions
  } = useSessionManager();

  const formattedSessions = sessions.map(session => ({
    ...session,
    isActive: session.id === currentSessionId
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="w-[300px] chat-glass-card chat-neon-border h-[500px] flex flex-col" onClick={handleClick}>
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-semibold">Chat Sessions</h2>
        <Badge variant="outline" className="text-xs">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </Badge>
      </div>
      <div className="flex-1 overflow-hidden">
        <SessionList
          sessions={formattedSessions}
          onSelectSession={switchSession}
        />
      </div>
      <SessionControls
        onNewSession={createSession}
        onCleanupSessions={cleanupInactiveSessions}
        sessionCount={sessions.length}
      />
    </div>
  );
}
