
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { MessageModule } from "../modules/MessageModule";
import { GitHubSyncModule } from "../modules/GitHubSyncModule";
import { NotificationsModule } from "../modules/NotificationsModule";
import { ChatInputModule } from "../modules/ChatInputModule";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";
import { AnimatePresence, motion } from "framer-motion";

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
  isEditorPage: boolean;
}

export function ChatContent({ scrollRef, isMinimized, isEditorPage }: ChatContentProps) {
  const { mode } = useChatMode();
  const { features } = useChatStore();

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
      >
        <CardContent className="p-4" onClick={handleContentClick}>
          {/* Message display area */}
          <MessageModule scrollRef={scrollRef} />
          
          <AnimatePresence>
            {/* Mode-specific modules */}
            {mode === 'editor' && (
              <motion.div 
                className="mt-4 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {features.githubSync && <GitHubSyncModule />}
                {features.notifications && <NotificationsModule />}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="p-4 border-t border-white/10" onClick={handleContentClick}>
          <ChatInputModule isEditorPage={isEditorPage} />
        </CardFooter>
      </motion.div>
    </AnimatePresence>
  );
}
