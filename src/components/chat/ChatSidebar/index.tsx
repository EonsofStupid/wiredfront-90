import React, { Suspense, lazy, useState } from "react";
import { useChatSessionManager } from '@/components/chat/chat-structure/chatsidebar/hooks/chat-sessions';
import { SessionControls } from '@/components/chat/chat-structure/chatsidebar/module/ChatSessionControls';
import { SessionHeader } from '@/components/chat/chat-structure/chatsidebar/module/ChatSessionHeader';
import { useChatStore } from "../store/chatStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorBoundary } from '@/components/chat/chat-structure/chatsidebar/hooks/useErrorBoundary';
import { ModeSelectionDialog } from '@/components/chat/chat-structure/chatsidebar/module/ModeSelectionDialog';
import { SessionList } from '@/components/chat/chat-structure/chatsidebar/module/ChatSessionList';
import { SessionSkeleton } from '@/components/chat/chat-structure/chatsidebar/module/ChatSessionSkeleton';

// Lazy load SessionList for performance
const LazySessionList = lazy(() => import('@/components/chat/chat-structure/chatsidebar/module/ChatSessionList').then(mod => ({ default: mod.SessionList })));
const LazySessionSkeleton = lazy(() => import('@/components/chat/chat-structure/chatsidebar/module/ChatSessionSkeleton').then(mod => ({ default: mod.SessionSkeleton })));

export const ChatSidebar = () => {
  const {
    sessions,
    currentSessionId,
    switchSession,
    createSession,
    cleanupInactiveSessions,
    clearSessions,
    isLoading,
  } = useChatSessionManager();
  const { ui } = useChatStore();
  const { ErrorBoundary } = useErrorBoundary();
  const [modeDialogOpen, setModeDialogOpen] = useState(false);

  const formattedSessions = sessions.map(session => ({
    id: session.id,
    lastAccessed: new Date(session.last_accessed),
    isActive: session.id === currentSessionId
  }));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCreateSession = async () => {
    // Open mode selection dialog instead of directly creating a session
    setModeDialogOpen(true);
  };

  const handleCreateWithMode = async (mode: string, providerId: string) => {
    // Create session with metadata for the selected mode
    await createSession({
      metadata: {
        mode,
        providerId
      }
    });
  };

  // Explicit handlers for different deletion operations
  const handleClearOtherSessions = async () => {
    await clearSessions(true); // Preserve current session
  };

  const handleClearAllSessions = async () => {
    await clearSessions(false); // Clear ALL sessions including current
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
        onNewSession={handleCreateSession}
        onClearSessions={handleClearOtherSessions}
        onCleanupSessions={cleanupInactiveSessions}
        onClearAllSessions={handleClearAllSessions}
        sessionCount={sessions.length}
        isLoading={isLoading || ui.sessionLoading}
      />

      <ModeSelectionDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
        onCreateSession={handleCreateWithMode}
      />
    </div>
  );
};
