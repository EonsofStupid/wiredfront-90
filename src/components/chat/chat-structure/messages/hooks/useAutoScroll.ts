
import { useCallback, useEffect } from 'react';

/**
 * Hook to handle auto-scrolling for chat messages
 */
export function useAutoScroll(scrollRef: React.RefObject<HTMLDivElement>) {
  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [scrollRef]);

  // Scroll to bottom on initial render
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return {
    scrollToBottom
  };
}
