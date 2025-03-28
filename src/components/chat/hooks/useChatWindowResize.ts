import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useChatWindowResize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 350,
    height: 500
  });

  const updateWindowSize = (size: WindowSize) => {
    setWindowSize(size);
  };

  useEffect(() => {
    const handleResize = () => {
      // Add any window resize logic here if needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
    setWindowSize: updateWindowSize
  };
} 