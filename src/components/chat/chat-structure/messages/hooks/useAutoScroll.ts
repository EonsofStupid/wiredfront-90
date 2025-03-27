import { useEffect, useRef } from 'react';

export function useAutoScroll(shouldAutoScroll: boolean = true) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [shouldAutoScroll]);

  return {
    messagesEndRef,
    scrollToBottom
  };
} 