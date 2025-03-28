
import { useCallback, useEffect, useState } from 'react';
import { useMessageStore } from '../messaging/MessageManager';

export const useAutoScroll = (scrollRef: React.RefObject<HTMLDivElement>) => {
  const { messages } = useMessageStore();
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && shouldAutoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef, shouldAutoScroll]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      
      // Consider "near bottom" if within 100px of bottom
      const isScrollNearBottom = scrollBottom < 100;
      setIsNearBottom(isScrollNearBottom);
      
      // Only auto-scroll if user is near bottom
      setShouldAutoScroll(isScrollNearBottom);
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [scrollRef]);
  
  // Auto-scroll when new messages are added
  useEffect(() => {
    if (messages.length > 0 && shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom, shouldAutoScroll]);
  
  return {
    scrollToBottom,
    isNearBottom,
    shouldAutoScroll,
    setShouldAutoScroll
  };
};
