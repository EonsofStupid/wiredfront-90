
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]'
};

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className="inline-flex items-center">
      <div 
        className={cn(
          "animate-spin rounded-full border-solid border-t-transparent",
          sizeClasses[size],
          "border-current opacity-75",
          className
        )}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

export default Spinner;
