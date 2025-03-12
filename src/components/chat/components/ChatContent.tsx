
import React, { Suspense, lazy } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { AnimatePresence, motion } from "framer-motion";
import { logger } from "@/services/chat/LoggingService";

// Lazy load modules for better performance
const MessageModule = lazy(() => import("../modules/MessageModule").then(mod => ({ default: mod.MessageModule })));
const ChatInputModule = lazy(() => import("../modules/ChatInputModule").then(mod => ({ default: mod.ChatInputModule })));
const StatusButton = lazy(() => import("../features/status-button").then(mod => ({ default: mod.StatusButton })));

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
  isEditorPage: boolean;
}

export function ChatContent({ scrollRef, isMinimized, isEditorPage }: ChatContentProps) {
  const { mode } = useChatMode();
  const { features } = useChatStore();
  const showStatusButton = features.githubSync || features.notifications;

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
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-16 w-1/2" />
              <Skeleton className="h-16 w-2/3" />
            </div>
          }>
            <MessageModule scrollRef={scrollRef} />
          </Suspense>
          
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
                <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                  <StatusButton />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-4 border-t border-white/10" onClick={handleContentClick}>
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <ChatInputModule isEditorPage={isEditorPage} />
          </Suspense>
        </CardFooter>
      </motion.div>
    </AnimatePresence>
  );
}
