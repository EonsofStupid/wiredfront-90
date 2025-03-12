
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Spinner } from '../components/Spinner';

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
  onClearSessions: () => void;
  sessionCount: number;
  isLoading?: boolean;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  onNewSession,
  onCleanupSessions,
  onClearSessions,
  sessionCount,
  isLoading = false
}) => {
  return (
    <div className="p-3 border-t border-white/10 flex justify-between items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2" 
              onClick={onNewSession}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : <Plus className="h-4 w-4 mr-1" />}
              New Chat
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start a new chat session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {sessionCount > 0 && (
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={onCleanupSessions}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clean up inactive sessions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={onClearSessions}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all sessions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

