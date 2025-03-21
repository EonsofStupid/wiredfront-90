import { chatLayoutStateAtom } from '@/features/chat/store/layout/atoms';
import { useChatMessageStore } from '@/features/chat/store/messageStore';
import { useChatModeStore } from '@/features/chat/store/modeStore';
import { useChatSessionStore } from '@/features/chat/store/sessionStore';
import { Message } from '@/types/chat/types';
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

export default useChat;
