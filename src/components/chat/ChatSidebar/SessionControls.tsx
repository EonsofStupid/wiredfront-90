import { Spinner } from "@/components/shared/Spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Plus, Trash2, TrashIcon, X } from "lucide-react";
import React from "react";

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
  onClearSessions: () => void;
  onClearAllSessions: () => void;
  sessionCount: number;
  isLoading?: boolean;
}

export const SessionControls = React.forwardRef<
  HTMLDivElement,
  SessionControlsProps
>(
  (
    {
      onNewSession,
      onCleanupSessions,
      onClearSessions,
      onClearAllSessions,
      sessionCount,
      isLoading = false,
    },
    ref
  ) => {
    return (
      <div
        className="p-3 border-t border-white/10 flex justify-between items-center gap-2"
        ref={ref}
      >
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
              <AlertDialogTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  disabled={isLoading}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <X className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Keep current, delete others</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20"
                style={{ zIndex: `var(--z-chat-modal)` }}
              >
                <AlertDialogHeader>
                  <AlertDialogPrimitive.Title>
                    Delete Other Sessions
                  </AlertDialogPrimitive.Title>
                  <AlertDialogPrimitive.Description>
                    This will delete ALL other chat sessions except the current
                    one. This action cannot be undone.
                  </AlertDialogPrimitive.Description>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/10"
                    onClick={() => {
                      const cancelButton = document.querySelector(
                        "[data-radix-alert-dialog-cancel]"
                      );
                      if (cancelButton instanceof HTMLElement) {
                        cancelButton.click();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      onClearSessions();
                      const actionButton = document.querySelector(
                        "[data-radix-alert-dialog-action]"
                      );
                      if (actionButton instanceof HTMLElement) {
                        actionButton.click();
                      }
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Others
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  disabled={isLoading}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center">
                          <TrashIcon className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete ALL sessions including current</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20"
                style={{ zIndex: `var(--z-chat-modal)` }}
              >
                <AlertDialogHeader>
                  <AlertDialogPrimitive.Title>
                    Delete All Sessions
                  </AlertDialogPrimitive.Title>
                  <AlertDialogPrimitive.Description>
                    This will delete ALL chat sessions, including the current
                    active one, and create a new empty session. This action
                    cannot be undone.
                  </AlertDialogPrimitive.Description>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/10"
                    onClick={() => {
                      const cancelButton = document.querySelector(
                        "[data-radix-alert-dialog-cancel]"
                      );
                      if (cancelButton instanceof HTMLElement) {
                        cancelButton.click();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      onClearAllSessions();
                      const actionButton = document.querySelector(
                        "[data-radix-alert-dialog-action]"
                      );
                      if (actionButton instanceof HTMLElement) {
                        actionButton.click();
                      }
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete All
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    );
  }
);
