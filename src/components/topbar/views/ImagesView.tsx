import React from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ImagesView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <p className="text-center text-muted-foreground">
          Drag and drop images here or click to browse
        </p>
      </div>
    </div>
  );
};