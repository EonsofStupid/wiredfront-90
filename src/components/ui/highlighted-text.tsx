import React from 'react';

interface HighlightedTextProps {
  text: string;
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, className = '' }) => {
  return (
    <span data-highlight className={className}>
      {text.split('').map((char, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
          {char}
        </span>
      ))}
    </span>
  );
};