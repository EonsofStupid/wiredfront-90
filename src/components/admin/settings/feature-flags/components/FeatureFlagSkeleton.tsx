
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export function FeatureFlagSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-5 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-8 bg-muted rounded w-full mt-2"></div>
          </CardContent>
          <CardFooter>
            <div className="h-5 bg-muted rounded w-1/4"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
