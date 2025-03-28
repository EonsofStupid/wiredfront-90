
import React from 'react';
import { Plus, Trash2, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SessionControlsProps {
  onNewSession: () => void;
  onClearSessions: () => void;
  onCleanupSessions: () => void;
  onClearAllSessions: () => void;
  sessionCount: number;
  isLoading: boolean;
}

export const SessionControls = ({
  onNewSession,
  onClearSessions,
  onCleanupSessions,
  onClearAllSessions,
  sessionCount,
  isLoading
}: SessionControlsProps) => {
  return (
    <div className="p-4 border-t flex justify-between items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onNewSession}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Start a new conversation</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading || sessionCount === 0}>
                <Clock className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Session management</TooltipContent>
        </Tooltip>
        
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onCleanupSessions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clean up inactive sessions
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onClearSessions}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear other sessions
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={onClearAllSessions}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all sessions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
