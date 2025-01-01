import { useCallback } from 'react';
import { useChatStore } from '@/stores/chat/store';
import { toast } from 'sonner';

interface ChatSessionManagerProps {
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onCloseSession: (sessionId: string) => void;
}

export const ChatSessionManager = ({
  onNewSession,
  onSwitchSession,
  onCloseSession
}: ChatSessionManagerProps) => {
  const { sessions, currentSessionId } = useChatStore();

  const handleNewSession = useCallback(() => {
    onNewSession();
    toast.success("New chat session created");
  }, [onNewSession]);

  const handleSwitchSession = useCallback((sessionId: string) => {
    onSwitchSession(sessionId);
  }, [onSwitchSession]);

  const handleCloseSession = useCallback((sessionId: string) => {
    if (Object.keys(sessions).length > 1) {
      onCloseSession(sessionId);
      toast.success("Chat session closed");
    } else {
      toast.error("You must have at least one active session");
    }
  }, [sessions, onCloseSession]);

  return null; // This is a logic-only component
};