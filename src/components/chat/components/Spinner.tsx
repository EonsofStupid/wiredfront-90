
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', label }) => {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`inline-block rounded-full border-t-transparent border-white animate-spin ${sizeClass} ${className}`}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className="mt-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};
