import { useChatMessageStore, useChatModeStore, useChatSessionStore } from '@/stores/features/chat';
import { chatLayoutStateAtom } from '@/stores/ui/chat/layout/atoms';
import type { Message } from '@/types/chat';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export const useChat = () => {
  const [layout] = useAtom(chatLayoutStateAtom);
  const { messages, addMessage, updateMessage, removeMessage, sendMessage } = useChatMessageStore();
  const { sessions, currentSession, setCurrentSession, createSession } = useChatSessionStore();
  const { currentMode, setMode } = useChatModeStore();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!currentSession) {
      const session = await createSession();
      setCurrentSession(session);
    }

    const messageId = await sendMessage(content, currentSession?.id || '');
    return messageId;
  }, [currentSession, createSession, setCurrentSession, sendMessage]);

  const handleUpdateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    updateMessage(messageId, updates);
  }, [updateMessage]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    removeMessage(messageId);
  }, [removeMessage]);

  const handleCreateSession = useCallback(async () => {
    const session = await createSession();
    setCurrentSession(session);
    return session;
  }, [createSession, setCurrentSession]);

  return {
    // Layout state
    layout,

    // Message state and actions
    messages,
    sendMessage: handleSendMessage,
    updateMessage: handleUpdateMessage,
    deleteMessage: handleDeleteMessage,

    // Session state and actions
    sessions,
    currentSession,
    createSession: handleCreateSession,

    // Mode state and actions
    currentMode,
    setMode,

    // UI preferences
    preferences: layout.uiPreferences
  };
};
