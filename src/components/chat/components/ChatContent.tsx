
import React from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { ModeSwitchModule } from "../modules/ModeSwitchModule";
import { MessageModule } from "../modules/MessageModule";
import { RAGModule } from "../modules/RAGModule";
import { GitHubSyncModule } from "../modules/GitHubSyncModule";
import { NotificationsModule } from "../modules/NotificationsModule";
import { ChatInputModule } from "../modules/ChatInputModule";
import { useChatMode } from "../providers/ChatModeProvider";

interface ChatContentProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  isMinimized: boolean;
}

export function ChatContent({ scrollRef, isMinimized }: ChatContentProps) {
  const { mode } = useChatMode();

  if (isMinimized) {
    return null;
  }

  return (
    <>
      <CardContent className="p-4">
        <div className="mb-4">
          <ModeSwitchModule />
        </div>
        
        {/* Message display area */}
        <MessageModule scrollRef={scrollRef} />
        
        {/* Mode-specific modules */}
        {mode === 'chat-only' && (
          <div className="mt-4 space-y-2">
            <RAGModule />
          </div>
        )}
        
        {mode === 'default' && (
          <div className="mt-4 space-y-2">
            <GitHubSyncModule />
            <NotificationsModule />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 border-t">
        <ChatInputModule />
      </CardFooter>
    </>
  );
}
