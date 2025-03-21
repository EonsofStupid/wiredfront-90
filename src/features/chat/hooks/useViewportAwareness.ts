import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/chatStore';

export function useViewportAwareness() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { setScale } = useChatStore();

  useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isOverflowingX = rect.right > window.innerWidth || rect.left < 0;
      const isOverflowingY = rect.bottom > window.innerHeight || rect.top < 0;

      setIsOverflowing(isOverflowingX || isOverflowingY);

      // Calculate scale if overflowing
      if (isOverflowingX || isOverflowingY) {
        const scaleX = window.innerWidth / rect.width;
        const scaleY = window.innerHeight / rect.height;
        const scale = Math.min(scaleX, scaleY, 1);
        setScale(scale);
      } else {
        setScale(1);
      }
    };

    // Check on mount and window resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [setScale]);

  return { containerRef, isOverflowing };
}
