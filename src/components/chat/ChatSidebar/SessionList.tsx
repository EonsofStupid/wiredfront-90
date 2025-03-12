
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
    <ScrollArea className="h-[400px] w-full pr-4">
      {sessions.length === 0 ? (
        <div className="text-center p-4 text-muted-foreground">
          No active sessions.
        </div>
      ) : (
        <motion.div 
          className="space-y-1"
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
