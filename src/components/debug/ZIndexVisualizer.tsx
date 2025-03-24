
import React, { useState, useEffect } from 'react';
import { ZIndex } from '@/styles/theme/zIndex';

interface ZLayerProps {
  name: string;
  value: number;
  color: string;
}

const ZLayer: React.FC<ZLayerProps> = ({ name, value, color }) => {
  return (
    <div 
      className="absolute left-4 w-32 h-10 rounded-md flex items-center justify-center text-xs font-mono border border-white/20"
      style={{ 
        zIndex: value, 
        top: `${value / 50}px`,
        backgroundColor: `${color}50`,
        color: 'white',
      }}
    >
      {name}: {value}
    </div>
  );
};

export const ZIndexVisualizer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+Alt+Z
      if (e.ctrlKey && e.altKey && e.key === 'z') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  const zIndexEntries = Object.entries(ZIndex) as [string, number][];
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-2 right-2 bg-black/80 p-2 rounded text-white text-xs">
        Z-Index Visualizer (Ctrl+Alt+Z to toggle)
      </div>
      
      {zIndexEntries.map(([name, value], index) => (
        <ZLayer 
          key={name}
          name={name}
          value={value}
          color={colors[index % colors.length]}
        />
      ))}
    </div>
  );
};
