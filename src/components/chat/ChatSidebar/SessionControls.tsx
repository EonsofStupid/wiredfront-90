import { Spinner } from "@/components/shared/Spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActionProps,
  AlertDialogCancel,
  AlertDialogCancelProps,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogDescriptionProps,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTitleProps,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Trash2, TrashIcon, X } from "lucide-react";
import React, { forwardRef } from "react";

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
  onClearSessions: () => void;
  onClearAllSessions: () => void;
  sessionCount: number;
  isLoading?: boolean;
}

// Custom components with proper typing
const StyledAlertDialogTitle = forwardRef<
  HTMLHeadingElement,
  AlertDialogTitleProps
>(({ children, ...props }, ref) => (
  <AlertDialogTitle ref={ref} {...props}>
    {children}
  </AlertDialogTitle>
));
StyledAlertDialogTitle.displayName = "StyledAlertDialogTitle";

const StyledAlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  AlertDialogDescriptionProps
>(({ children, ...props }, ref) => (
  <AlertDialogDescription ref={ref} {...props}>
    {children}
  </AlertDialogDescription>
));
StyledAlertDialogDescription.displayName = "StyledAlertDialogDescription";

const StyledAlertDialogCancel = forwardRef<
  HTMLButtonElement,
  AlertDialogCancelProps
>(({ children, ...props }, ref) => (
  <AlertDialogCancel ref={ref} {...props}>
    {children}
  </AlertDialogCancel>
));
StyledAlertDialogCancel.displayName = "StyledAlertDialogCancel";

const StyledAlertDialogAction = forwardRef<
  HTMLButtonElement,
  AlertDialogActionProps
>(({ children, ...props }, ref) => (
  <AlertDialogAction ref={ref} {...props}>
    {children}
  </AlertDialogAction>
));
StyledAlertDialogAction.displayName = "StyledAlertDialogAction";

export const SessionControls: React.FC<SessionControlsProps> = ({
  onNewSession,
  onCleanupSessions,
  onClearSessions,
  onClearAllSessions,
  sessionCount,
  isLoading = false,
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
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Plus className="h-4 w-4 mr-1" />
              )}
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

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>
                <TooltipContent>
                  <p>Keep current, delete others</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent
              className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20"
              style={{ zIndex: 9900 }}
            >
              <AlertDialogHeader>
                <StyledAlertDialogTitle>
                  Delete Other Sessions
                </StyledAlertDialogTitle>
                <StyledAlertDialogDescription>
                  This will delete ALL other chat sessions except the current
                  one. This action cannot be undone.
                </StyledAlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <StyledAlertDialogCancel className="border-white/10 hover:bg-white/10">
                  Cancel
                </StyledAlertDialogCancel>
                <StyledAlertDialogAction
                  onClick={onClearSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Others
                </StyledAlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                  <p>Delete ALL sessions including current</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent
              className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20"
              style={{ zIndex: 9900 }}
            >
              <AlertDialogHeader>
                <StyledAlertDialogTitle>
                  Delete All Sessions
                </StyledAlertDialogTitle>
                <StyledAlertDialogDescription>
                  This will delete ALL chat sessions, including the current
                  active one, and create a new empty session. This action cannot
                  be undone.
                </StyledAlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <StyledAlertDialogCancel className="border-white/10 hover:bg-white/10">
                  Cancel
                </StyledAlertDialogCancel>
                <StyledAlertDialogAction
                  onClick={onClearAllSessions}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All
                </StyledAlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
