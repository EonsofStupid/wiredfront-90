
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';

interface FeatureFlagEmptyStateProps {
  onCreateFlag: () => void;
  isSuperAdmin: boolean;
  searchQuery: string;
}

export function FeatureFlagEmptyState({ 
  onCreateFlag, 
  isSuperAdmin, 
  searchQuery 
}: FeatureFlagEmptyStateProps) {
  return (
    <Card className="bg-background border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Info className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-center">No feature flags found</p>
        <p className="text-muted-foreground text-center mt-1">
          {searchQuery
            ? "Try adjusting your search criteria"
            : "Create your first feature flag to get started"}
        </p>
        {isSuperAdmin && !searchQuery && (
          <Button onClick={onCreateFlag} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            New Feature Flag
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
