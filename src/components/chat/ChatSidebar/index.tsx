import React, { useState, useEffect } from 'react';
import { ModeSelectionDialog } from '../SessionManagement/ModeSelectionDialog';
import { useChatStore } from '../store/chatStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SessionItem } from './SessionItem';
import { Spinner } from '../ui/Spinner';

export function ChatSidebar() {
  const [isModeDialogOpen, setIsModeDialogOpen] = useState(false);
  const { availableProviders, currentProvider } = useChatStore();
  const { sessions, currentSessionId, switchSession, createSession } = useSessionManager();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (availableProviders.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [availableProviders]);

  const handleCreateSession = async (mode: string, providerId: string) => {
    setIsModeDialogOpen(false);
    await createSession(mode, providerId);
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
            <Spinner size="sm" label="Loading providers..." />
          </div>
        ) : (
          sessions && Object.entries(sessions).map(([sessionId, session]) => (
            <SessionItem
              key={sessionId}
              sessionId={sessionId}
              session={session}
              isActive={sessionId === currentSessionId}
              onSelect={() => switchSession(sessionId)}
            />
          ))
        )}
      </ScrollArea>
      
      <ModeSelectionDialog
        open={isModeDialogOpen}
        onClose={() => setIsModeDialogOpen(false)}
        onOpenChange={setIsModeDialogOpen}
        onCreateSession={handleCreateSession}
        availableProviders={availableProviders}
        currentProvider={currentProvider}
      />
    </div>
  );
}
