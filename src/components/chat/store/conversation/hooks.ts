
import { useEffect } from 'react';
import { useConversationStore } from './store';
import { useChatStore } from '../chatStore';
import { useMessageStore } from '../../messaging/MessageManager';

/**
 * Hook to sync the current conversation with the chat mode
 * This ensures that the chat mode and conversation mode are in sync
 */
export const useSyncConversationMode = () => {
  const { currentConversationId, updateConversation } = useConversationStore();
  const currentMode = useChatStore(state => state.currentMode);
  
  useEffect(() => {
    if (currentConversationId) {
      updateConversation(currentConversationId, { mode: currentMode });
    }
  }, [currentMode, currentConversationId, updateConversation]);
};

/**
 * Hook to load messages for the current conversation
 */
export const useLoadConversationMessages = () => {
  const currentConversationId = useConversationStore(state => state.currentConversationId);
  const { loadMessages, clearMessages } = useMessageStore();
  const { setSessionLoading } = useChatStore();
  
  useEffect(() => {
    if (currentConversationId) {
      setSessionLoading(true);
      loadMessages(currentConversationId)
        .finally(() => setSessionLoading(false));
    } else {
      clearMessages();
    }
  }, [currentConversationId, loadMessages, clearMessages, setSessionLoading]);
};
