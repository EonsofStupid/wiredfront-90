
import React, { Suspense, lazy, useEffect } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";
import { Spinner } from "./Spinner";
import { useErrorBoundary } from "../hooks/useErrorBoundary";

// Lazy load modules for better performance
const MessageModule = lazy(() => 
  import("../modules/MessageModule")
    .then(mod => ({ default: mod.MessageModule }))
    .catch(error => {
      logger.error('Failed to load MessageModule', { error });
      throw error;
    })
);

const ChatInputModule = lazy(() => 
  import("../modules/ChatInputModule")
    .then(mod => ({ default: mod.ChatInputModule }))
    .catch(error => {
      logger.error('Failed to load ChatInputModule', { error });
      throw error;
    })
);

const StatusButton = lazy(() => 
  import("../features/status-button")
    .then(mod => ({ default: mod.StatusButton }))
    .catch(error => {
      logger.error('Failed to load StatusButton', { error });
      throw error;
    })
);

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
  isEditorPage: boolean;
}

export function ChatContent({ scrollRef, isMinimized, isEditorPage }: ChatContentProps) {
  const { mode } = useChatMode();
  const { features } = useChatStore();
  const showStatusButton = features.githubSync || features.notifications;
  const { ErrorBoundary, DefaultErrorFallback } = useErrorBoundary();

  React.useEffect(() => {
    logger.info('ChatContent rendered', { mode, isEditorPage, isMinimized });
  }, [mode, isEditorPage, isMinimized]);

  if (isMinimized) {
    return null;
  }

  // Prevent event propagation to avoid triggering drag
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const MessageFallback = () => (
    <div className="space-y-4" aria-busy="true" aria-label="Loading messages">
      <Skeleton className="h-16 w-3/4" />
      <Skeleton className="h-16 w-1/2" />
      <Skeleton className="h-16 w-2/3" />
    </div>
  );

  const InputFallback = () => (
    <Skeleton className="h-10 w-full" aria-busy="true" aria-label="Loading input" />
  );

  const StatusButtonFallback = () => (
    <Skeleton className="h-8 w-20" aria-busy="true" aria-label="Loading status button" />
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        data-testid="chat-content"
      >
        <CardContent className="p-4" onClick={handleContentClick}>
          {/* Message display area */}
          <ErrorBoundary
            fallback={
              <div className="p-4 border border-destructive/20 rounded-md bg-destructive/10 text-center">
                <DefaultErrorFallback />
                <button 
                  className="mt-2 px-3 py-1 text-xs bg-primary/80 text-primary-foreground rounded"
                  onClick={() => window.location.reload()}
                >
                  Reload Application
                </button>
              </div>
            }
          >
            <Suspense fallback={<MessageFallback />}>
              <MessageModule scrollRef={scrollRef} />
            </Suspense>
          </ErrorBoundary>
          
          {/* Status button (only in editor mode) */}
          <AnimatePresence>
            {mode === 'editor' && showStatusButton && (
              <motion.div 
                className="flex justify-end mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Suspense fallback={<StatusButtonFallback />}>
                  <StatusButton />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-4 border-t border-white/10" onClick={handleContentClick}>
          <ErrorBoundary
            fallback={
              <div className="w-full p-3 border border-destructive/20 rounded-md bg-destructive/10 text-center">
                <p className="text-sm">Failed to load chat input</p>
                <button 
                  className="mt-2 px-3 py-1 text-xs bg-primary/80 text-primary-foreground rounded"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            }
          >
            <Suspense fallback={<InputFallback />}>
              <ChatInputModule isEditorPage={isEditorPage} />
            </Suspense>
          </ErrorBoundary>
        </CardFooter>
      </motion.div>
    </AnimatePresence>
  );
}
