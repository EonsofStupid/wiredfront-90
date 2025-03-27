
import React from 'react';
import { Button } from "@/components/ui/button";
import { Github, BellRing } from "lucide-react";
import { useChatStore } from '../../store/chatStore';

export function StatusButton() {
  const { features } = useChatStore();
  
  return (
    <div className="flex gap-2 items-center justify-end">
      {features.githubSync && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs flex items-center gap-1 border-green-500/30 bg-green-500/10 hover:bg-green-500/20"
        >
          <Github className="h-3 w-3" />
          <span>Repo Connected</span>
        </Button>
      )}
      
      {features.notifications && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs flex items-center gap-1 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20"
        >
          <BellRing className="h-3 w-3" />
          <span>Notifications On</span>
        </Button>
      )}
    </div>
  );
}
