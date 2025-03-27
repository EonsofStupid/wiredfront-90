
import { useCallback, useRef, RefObject } from 'react';

export function useAutoScroll(scrollRef: RefObject<HTMLDivElement>) {
  const autoScrollEnabled = useRef(true);
  const lastScrollTop = useRef(0);
  const lastScrollHeight = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current || !autoScrollEnabled.current) return;

    const scrollElement = scrollRef.current;
    scrollElement.scrollTop = scrollElement.scrollHeight;
    lastScrollTop.current = scrollElement.scrollTop;
    lastScrollHeight.current = scrollElement.scrollHeight;
  }, [scrollRef]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const scrollElement = scrollRef.current;
    
    // Check if scroll is at the bottom (with a small threshold for browser inconsistencies)
    const isAtBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight < 20;
    
    // If user has scrolled up, disable auto-scroll
    if (!isAtBottom && scrollElement.scrollTop < lastScrollTop.current) {
      autoScrollEnabled.current = false;
    }
    
    // If user manually scrolled to bottom, re-enable auto-scroll
    if (isAtBottom) {
      autoScrollEnabled.current = true;
    }
    
    lastScrollTop.current = scrollElement.scrollTop;
  }, [scrollRef]);

  return {
    scrollToBottom,
    handleScroll,
    isAutoScrollEnabled: autoScrollEnabled.current
  };
}
