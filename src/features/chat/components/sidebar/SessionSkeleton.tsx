import React from 'react';

export const SessionSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2 opacity-70" />
        </div>
      ))}
    </div>
  );
};
