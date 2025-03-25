import React, { useState, useEffect } from 'react';
import { ModeSelectionDialog } from '../SessionManagement/ModeSelectionDialog';
import { useChatStore } from '../store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SessionItem } from './SessionItem';
import { Spinner } from '@/components/ui/spinner';

export function ChatSidebar() {
  const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);
  const { availableProviders, currentProvider } = useChatStore();
  const { sessions, currentSessionId, switchSession, createSession } = useSessionManager();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(availableProviders.length === 0);
  }, [availableProviders]);

  const handleCreateSession = async (mode: string, providerId: string) => {
    setIsModeDialogOpen(false);
    await createSession({
      metadata: {
        mode,
        providerId
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-sidebar-background border-r border-separator w-64">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Chat Sessions</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsModeDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="sm" />
            <span className="ml-2 text-sm text-muted-foreground">Loading providers...</span>
          </div>
        ) : (
          sessions && Object.entries(sessions).map(([sessionId, session]) => (
            <SessionItem
              key={sessionId}
              id={sessionId}
              lastAccessed={new Date(session.last_accessed)}
              isActive={sessionId === currentSessionId}
              messageCount={session.message_count}
              title={session.title}
              onSelect={() => switchSession(sessionId)}
              provider={session.providerId} // ✅ Fixed from provider_id
            />
          ))
        )}
      </ScrollArea>
      
      <ModeSelectionDialog
        open={isModeDialogOpen}
        onClose={() => setIsModeDialogOpen(false)} // ✅ Required prop
        onOpenChange={setIsModeDialogOpen}
        onCreateSession={handleCreateSession}
        availableProviders={availableProviders}
        currentProvider={currentProvider}
      />
    </div>
  );
}
