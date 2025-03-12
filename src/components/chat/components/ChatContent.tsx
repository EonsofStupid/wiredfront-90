
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { MessageModule } from "../modules/MessageModule";
import { ChatInputModule } from "../modules/ChatInputModule";
import { StatusButton } from "../features/status-button/StatusButton";
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
  const showStatusButton = features.githubSync || features.notifications;

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
                <StatusButton />
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
