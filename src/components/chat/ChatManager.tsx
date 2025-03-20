
import { chatSessionsService } from '@/services/chat/chatSessionsService';
import { EnhancedChatSession } from '@/types/chat/preferences';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ChatManager() {
  const [sessions, setSessions] = useState<EnhancedChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const data = await chatSessionsService.fetchSessions();
        setSessions(data);
      } catch (err) {
        console.error('Error loading chat sessions:', err);
        setError(err instanceof Error ? err : new Error('Failed to load sessions'));
        toast.error('Failed to load chat sessions');
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  if (loading) {
    return <div className="p-4">Loading chat sessions...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-medium mb-4">No chat sessions yet</h2>
        <p className="text-muted-foreground">
          Start a new chat to begin your conversation
        </p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
          onClick={async () => {
            try {
              await chatSessionsService.createSession({
                title: 'New Chat',
                mode: 'chat'
              });
              // Reload sessions after creating a new one
              const refreshedSessions = await chatSessionsService.fetchSessions();
              setSessions(refreshedSessions);
              toast.success('New chat session created');
            } catch (err) {
              console.error('Error creating session:', err);
              toast.error('Failed to create new chat session');
            }
          }}
        >
          New Chat
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-medium mb-4">Your Chat Sessions</h2>
      <div className="space-y-2">
        {sessions.map(session => (
          <div
            key={session.id}
            className="p-3 border rounded hover:bg-accent cursor-pointer"
          >
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-sm text-muted-foreground">
              Mode: {session.mode}
            </p>
            <p className="text-xs text-muted-foreground">
              Created: {new Date(session.created_at || '').toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
        onClick={async () => {
          try {
            await chatSessionsService.createSession({
              title: 'New Chat',
              mode: 'chat'
            });
            // Reload sessions after creating a new one
            const refreshedSessions = await chatSessionsService.fetchSessions();
            setSessions(refreshedSessions);
            toast.success('New chat session created');
          } catch (err) {
            console.error('Error creating session:', err);
            toast.error('Failed to create new chat session');
          }
        }}
      >
        New Chat
      </button>
    </div>
  );
}
