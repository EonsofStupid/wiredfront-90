
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeMap: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeMap[size],
        className
      )} 
    />
  );
}
