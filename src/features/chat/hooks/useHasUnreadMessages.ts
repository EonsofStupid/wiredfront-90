
import { useEffect, useState } from 'react';
import { useChatMessageStore } from '@/stores/features/chat/messageStore';

/**
 * Hook to check if there are any unread messages in the current chat
 */
export function useHasUnreadMessages() {
  const { messages } = useChatMessageStore();
  const [hasUnread, setHasUnread] = useState(false);
  
  useEffect(() => {
    // Check if there are any unread messages from the assistant
    const unreadMessages = messages.filter(
      msg => msg.role === 'assistant' && msg.message_status === 'delivered' && !msg.read
    );
    
    setHasUnread(unreadMessages.length > 0);
  }, [messages]);
  
  return hasUnread;
}
