
import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatContent } from "./ChatContent";
import { motion } from "framer-motion";

interface ChatContainerCardProps {
  title: string;
  showSidebar: boolean;
  isMinimized: boolean;
  onToggleSidebar: () => void;
  onMinimize: () => void;
  onClose: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  isEditorPage: boolean;
  docked: boolean;
  style?: React.CSSProperties;
  onClick: (e: React.MouseEvent) => void;
  containerRef: React.Ref<HTMLDivElement>;
  dragHandleProps?: any;
}

export function ChatContainerCard({
  title,
  showSidebar,
  isMinimized,
  onToggleSidebar,
  onMinimize,
  onClose,
  scrollRef,
  isEditorPage,
  docked,
  style,
  onClick,
  containerRef,
  dragHandleProps = {}
}: ChatContainerCardProps) {
  return (
    <motion.div 
      ref={containerRef}
      style={style}
      {...(docked ? {} : dragHandleProps)}
      className="w-[var(--chat-width)] transition-all duration-300 chat-container"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      data-testid="chat-container"
    >
      <Card className="shadow-xl glass-card neon-border overflow-hidden h-full">
        <CardHeader className={`p-0 ${docked ? '' : 'cursor-move'}`}>
          <ChatHeader 
            title={title}
            showSidebar={showSidebar}
            isMinimized={isMinimized}
            onToggleSidebar={onToggleSidebar}
            onMinimize={onMinimize}
            onClose={onClose}
          />
        </CardHeader>

        <ChatContent 
          scrollRef={scrollRef} 
          isMinimized={isMinimized} 
          isEditorPage={isEditorPage}
        />
      </Card>
    </motion.div>
  );
}
