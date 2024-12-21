import { useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseWindowPositionProps {
  width: number;
  height: number;
  margin: number;
}

export const useWindowPosition = ({ width, height, margin }: UseWindowPositionProps) => {
  const [position, setPosition] = useState<Position>(() => ({
    x: window.innerWidth - width - margin,
    y: window.innerHeight - height - 48
  }));

  const resetPosition = () => {
    setPosition({
      x: window.innerWidth - width - margin,
      y: window.innerHeight - height - 48
    });
  };

  return { position, setPosition, resetPosition };
};