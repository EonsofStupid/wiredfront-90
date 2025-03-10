
import React from "react";
import { Card } from "@/components/ui/card";
import { SessionList } from "./SessionList";
import { SessionControls } from "./SessionControls";
import { useSessionManager } from "@/hooks/useSessionManager";

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
    <Card className="w-[300px] glass-card neon-border h-[500px] flex flex-col" onClick={handleClick}>
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Sessions</h2>
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
      />
    </Card>
  );
};
