
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X, TrashIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Spinner } from '../components/Spinner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
  onClearSessions: () => void;
  onClearAllSessions: () => void;
  sessionCount: number;
  isLoading?: boolean;
}

export const SessionControls: React.FC<SessionControlsProps> = ({
  onNewSession,
  onCleanupSessions,
  onClearSessions,
  onClearAllSessions,
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
                <p>Clear all sessions except current</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:bg-red-500/20 hover:text-red-500 transition-colors"
                      disabled={isLoading}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <TooltipContent>
                  <p>Clear ALL sessions including current</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20" style={{ zIndex: 9900 }}>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Sessions</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete ALL chat sessions, including the current one. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onClearAllSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
