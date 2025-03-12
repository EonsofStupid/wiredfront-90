
import React, { Suspense, lazy } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";
import { Spinner } from "./Spinner";
import { useErrorBoundary } from "../hooks/useErrorBoundary";

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
        className="flex flex-col h-full relative overflow-hidden"
        data-testid="chat-content"
      >
        <CardContent 
          className="flex-1 p-4 overflow-hidden pb-20" 
          onClick={handleContentClick}
        >
          <ErrorBoundary
            fallback={<DefaultErrorFallback />}
          >
            <Suspense fallback={<MessageFallback />}>
              <MessageModule scrollRef={scrollRef} />
            </Suspense>
          </ErrorBoundary>
          
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
        </CardContent>

        <CardFooter 
          className="p-4 border-t border-white/10 fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 chat-input-container"
          onClick={handleContentClick}
        >
          <ErrorBoundary
            fallback={<DefaultErrorFallback />}
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
