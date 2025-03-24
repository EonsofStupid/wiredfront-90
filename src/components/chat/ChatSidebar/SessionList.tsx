
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionItem } from "./SessionItem";
import { motion } from "framer-motion";
import { useChatStore } from "../store/chatStore";
import { ChatMode } from "@/integrations/supabase/types/enums";

interface SessionListProps {
  sessions: Array<{
    id: string;
    lastAccessed: Date;
    isActive: boolean;
    provider?: string;
    messageCount?: number;
    mode?: ChatMode;
    title?: string;
    archived?: boolean;
  }>;
  onSelectSession: (id: string) => void;
}

export const SessionList = ({ sessions, onSelectSession }: SessionListProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Get current provider from chat store
  const currentProvider = useChatStore(state => state.currentProvider);

  // Filter out archived sessions
  const activeSessions = sessions.filter(session => !session.archived);

  return (
    <ScrollArea className="h-full w-full pr-4 chat-messages-container">
      {activeSessions.length === 0 ? (
        <div className="text-center p-6 text-muted-foreground flex flex-col items-center justify-center h-full">
          <div className="opacity-60 mb-2">🔄</div>
          <div className="text-chat-message-system-text">No active sessions</div>
          <div className="text-xs mt-2 opacity-60 max-w-[200px]">
            Create a new session to start chatting
          </div>
        </div>
      ) : (
        <motion.div 
          className="space-y-1 p-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activeSessions.map((session) => (
            <motion.div key={session.id} variants={item}>
              <SessionItem
                id={session.id}
                title={session.title}
                lastAccessed={session.lastAccessed}
                isActive={session.isActive}
                onSelect={onSelectSession}
                provider={session.provider || currentProvider?.name}
                messageCount={session.messageCount}
                mode={session.mode} // Pass the mode to SessionItem
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </ScrollArea>
  );
};
