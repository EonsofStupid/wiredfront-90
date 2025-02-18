
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

  return (
    <Card className="w-[300px] glass-card neon-border">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Sessions</h2>
      </div>
      <SessionList
        sessions={formattedSessions}
        onSelectSession={switchSession}
      />
      <SessionControls
        onNewSession={createSession}
        onCleanupSessions={cleanupInactiveSessions}
      />
    </Card>
  );
};
