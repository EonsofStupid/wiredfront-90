
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionItem } from "./SessionItem";
import { motion } from "framer-motion";

interface SessionListProps {
  sessions: Array<{
    id: string;
    lastAccessed: Date;
    isActive: boolean;
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

  return (
    <ScrollArea className="h-full w-full pr-4 chat-messages-container">
      {sessions.length === 0 ? (
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
          {sessions.map((session) => (
            <motion.div key={session.id} variants={item}>
              <SessionItem
                id={session.id}
                lastAccessed={session.lastAccessed}
                isActive={session.isActive}
                onSelect={onSelectSession}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </ScrollArea>
  );
};
