import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glow';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-4',
  lg: 'h-10 w-10 border-4',
};

export const Spinner = ({
  size = 'md',
  variant = 'default',
  className,
}: SpinnerProps) => {
  const glow = variant === 'glow';

  return (
    <div
      className={clsx(
        'rounded-full border-t-transparent animate-spin',
        sizeMap[size],
        glow
          ? 'border-pink-500/80 shadow-[0_0_12px_2px_rgba(255,0,150,0.4)]'
          : 'border-slate-300 dark:border-slate-500',
        className
      )}
    />
  );
};
