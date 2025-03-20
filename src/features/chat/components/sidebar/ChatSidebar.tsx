import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { ChatService } from '../../service';
import { useChatStore } from '../../store';
import type { ChatSession } from '../../types';
import { SessionHeader } from './SessionHeader';
import { SessionList } from './SessionList';

export const ChatSidebar: React.FC = () => {
  const {
    currentSessionId,
    currentMode,
    isLoading,
    setCurrentSession,
    setError,
  } = useChatStore();

  const handleNewSession = useCallback(async () => {
    try {
      const session = await ChatService.createSession('New Chat', currentMode);
      setCurrentSession(session.id);
      toast.success('New chat session created');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create session';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [currentMode, setCurrentSession, setError]);

  const handleSelectSession = useCallback((session: ChatSession) => {
    setCurrentSession(session.id);
  }, [setCurrentSession]);

  const handleEditSession = useCallback(async (session: ChatSession) => {
    try {
      const title = window.prompt('Enter new session title:', session.title);
      if (title && title !== session.title) {
        await ChatService.updateSession(session.id, { title });
        toast.success('Session updated');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update session';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [setError]);

  const handleDeleteSession = useCallback(async (session: ChatSession) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await ChatService.deleteSession(session.id);
      toast.success('Session deleted');

      // If the deleted session was the current one, clear the current session
      if (session.id === currentSessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete session';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [currentSessionId, setCurrentSession, setError]);

  return (
    <div className="w-80 h-full border-r bg-background">
      <SessionHeader onNewSession={handleNewSession} />
      <SessionList
        sessions={[]} // TODO: Add sessions state
        currentSessionId={currentSessionId}
        isLoading={isLoading}
        onSelectSession={handleSelectSession}
        onEditSession={handleEditSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
};
