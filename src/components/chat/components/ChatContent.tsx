
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { MessageModule } from "../modules/MessageModule";
import { RAGModule } from "../modules/RAGModule";
import { GitHubSyncModule } from "../modules/GitHubSyncModule";
import { NotificationsModule } from "../modules/NotificationsModule";
import { ChatInputModule } from "../modules/ChatInputModule";
import { useChatMode } from "../providers/ChatModeProvider";
import { useChatStore } from "../store/chatStore";

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
    <>
      <CardContent className="p-4" onClick={handleContentClick}>
        {/* Message display area */}
        <MessageModule scrollRef={scrollRef} />
        
        {/* Mode-specific modules */}
        {mode === 'standard' && features.ragSupport && (
          <div className="mt-4 space-y-2">
            <RAGModule />
          </div>
        )}
        
        {mode === 'chat-only' && features.ragSupport && (
          <div className="mt-4 space-y-2">
            <RAGModule />
          </div>
        )}
        
        {mode === 'editor' && (
          <div className="mt-4 space-y-2">
            {features.githubSync && <GitHubSyncModule />}
            {features.notifications && <NotificationsModule />}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t" onClick={handleContentClick}>
        <ChatInputModule isEditorPage={isEditorPage} />
      </CardFooter>
    </>
  );
}
