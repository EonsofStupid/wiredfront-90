import { useCallback, useRef } from 'react';

export function useAutoScroll(scrollRef: React.RefObject<HTMLElement>) {
  const isScrolledToBottom = useRef(true);

  // Check if user is scrolled to bottom (or near bottom)
  const checkScrollPosition = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Consider "near bottom" if within 100px of the bottom
    const scrollThreshold = 100;
    isScrolledToBottom.current = scrollHeight - scrollTop - clientHeight <= scrollThreshold;
  }, [scrollRef]);

  // Manually scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [scrollRef]);

  // Auto-scroll only if already at bottom
  const autoScrollIfAtBottom = useCallback(() => {
    if (isScrolledToBottom.current && scrollRef.current) {
      scrollToBottom();
    }
  }, [isScrolledToBottom, scrollRef, scrollToBottom]);

  return {
    scrollToBottom,
    checkScrollPosition,
    autoScrollIfAtBottom,
    isScrolledToBottom: () => isScrolledToBottom.current
  };
}
