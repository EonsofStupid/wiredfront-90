import React from 'react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProjectsView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Github className="h-6 w-6" />
          <span>Connect GitHub Repository</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-24 flex flex-col items-center justify-center gap-2"
        >
          <Github className="h-6 w-6" />
          <span>Manage GitHub PAT</span>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-muted/50">
        <p className="text-center text-muted-foreground">
          Connect to GitHub to manage your repositories
        </p>
      </div>
    </div>
  );
};