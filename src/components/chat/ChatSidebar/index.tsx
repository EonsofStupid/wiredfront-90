
import React, { Suspense, lazy } from "react";
import { SessionControls } from "./SessionControls";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SessionHeader } from "./SessionHeader";
import { useChatStore } from "../store/chatStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorBoundary } from "../hooks/useErrorBoundary";

// Lazy load SessionList for performance
const SessionList = lazy(() => import("./SessionList").then(mod => ({ default: mod.SessionList })));
const SessionSkeleton = lazy(() => import("./SessionSkeleton"));

export const ChatSidebar = () => {
  const {
    sessions,
    currentSessionId,
    switchSession,
    createSession,
    cleanupInactiveSessions,
    isLoading
  } = useSessionManager();
  const { ui } = useChatStore();
  const { ErrorBoundary } = useErrorBoundary();

  const formattedSessions = sessions.map(session => ({
    ...session,
    isActive: session.id === currentSessionId
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="w-[300px] chat-glass-card chat-neon-border h-[500px] flex flex-col" 
      onClick={handleClick}
      data-testid="chat-sidebar"
    >
      <SessionHeader sessionCount={sessions.length} />
      
      <div className="flex-1 overflow-hidden">
        <ErrorBoundary
          fallback={
            <div className="p-4 text-center">
              <p className="text-sm text-destructive">Failed to load sessions</p>
              <button 
                className="mt-2 px-3 py-1 text-xs bg-primary/80 text-primary-foreground rounded"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          }
        >
          <Suspense fallback={
            <div className="p-4">
              <Skeleton className="h-6 w-24 mb-4" />
              <SessionSkeleton count={4} />
            </div>
          }>
            {isLoading || ui.sessionLoading ? (
              <SessionSkeleton count={4} />
            ) : (
              <SessionList
                sessions={formattedSessions}
                onSelectSession={switchSession}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
      
      <SessionControls
        onNewSession={createSession}
        onCleanupSessions={cleanupInactiveSessions}
        sessionCount={sessions.length}
        isLoading={isLoading || ui.sessionLoading}
      />
    </div>
  );
};
