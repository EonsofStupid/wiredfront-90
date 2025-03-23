import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { logger } from "@/services/chat/LoggingService";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, lazy, useEffect } from "react";
import { useErrorBoundary } from "../hooks/useErrorBoundary";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { MessageSkeleton } from "./MessageSkeleton";

// Lazy load modules for better performance
const MessageModule = lazy(() =>
  import("../modules/MessageModule")
    .then((mod) => ({ default: mod.MessageModule }))
    .catch((error) => {
      logger.error("Failed to load MessageModule", { error });
      throw error;
    })
);

const ChatInputModule = lazy(() =>
  import("../modules/ChatInputModule")
    .then((mod) => ({ default: mod.ChatInputModule }))
    .catch((error) => {
      logger.error("Failed to load ChatInputModule", { error });
      throw error;
    })
);

const StatusButton = lazy(() =>
  import("../features/status-button")
    .then((mod) => ({ default: mod.StatusButton }))
    .catch((error) => {
      logger.error("Failed to load StatusButton", { error });
      throw error;
    })
);

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
  isEditorPage?: boolean;
}

export function ChatContent({
  scrollRef,
  isMinimized,
  isEditorPage = false,
}: ChatContentProps) {
  const { mode } = useChatMode();
  const { features, ui } = useChatStore();
  const showStatusButton = features.githubSync || features.notifications;
  const { ErrorBoundary, DefaultErrorFallback } = useErrorBoundary();

  useEffect(() => {
    logger.info("ChatContent rendered", { mode, isEditorPage, isMinimized });
  }, [mode, isEditorPage, isMinimized]);

  if (isMinimized) {
    return null;
  }

  // Prevent event propagation to avoid triggering drag
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const MessageFallback = () => (
    <div
      className="space-y-4 p-4"
      aria-busy="true"
      aria-label="Loading messages"
    >
      <MessageSkeleton role="user" lines={1} />
      <MessageSkeleton role="assistant" lines={2} />
      <MessageSkeleton role="user" lines={1} />
    </div>
  );

  const InputFallback = () => (
    <div className="w-full p-4" aria-busy="true" aria-label="Loading input">
      <Skeleton className="h-10 w-full rounded-md" />
      <div className="flex justify-between mt-2">
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );

  const StatusButtonFallback = () => (
    <div className="flex justify-end mt-4 px-4">
      <Skeleton
        className="h-8 w-32 rounded-full"
        aria-busy="true"
        aria-label="Loading status button"
      />
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-full"
        data-testid="chat-content"
      >
        <CardContent
          className="p-4 flex-1 overflow-hidden flex flex-col"
          onClick={handleContentClick}
        >
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
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<MessageFallback />}>
                <MessageModule scrollRef={scrollRef} />
              </Suspense>
            </div>
          </ErrorBoundary>

          {/* Status button (show in all modes) */}
          <AnimatePresence>
            {showStatusButton && (
              <motion.div
                className="flex justify-end mt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
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

        <CardFooter
          className="p-4 border-t border-white/10 mt-auto"
          onClick={handleContentClick}
        >
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
