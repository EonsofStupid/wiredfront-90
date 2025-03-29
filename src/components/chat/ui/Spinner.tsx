
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}

/**
 * Generic loading spinner component
 */
export function Spinner({ size = 'md', className, color }: SpinnerProps) {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClass = color || 'text-primary';
  
  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeMap[size],
        colorClass,
        className
      )} 
    />
  );
}
