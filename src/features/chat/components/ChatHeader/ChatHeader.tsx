import { Button } from '@/components/ui/button';
import { useChatLayoutStore } from '@/features/chat/store/chatLayoutStore';
import { useChatModeStore } from '@/features/chat/store/modeStore';
import { cn } from '@/lib/utils';
import { ChatMode } from '@/types/chat/modes';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, X } from 'lucide-react';
import React from 'react';
import { ModeSelectionDialog } from '../session/ModeSelectionDialog';

interface ChatHeaderProps {
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
  const { currentMode, setCurrentMode } = useChatModeStore();
  const { isMinimized, toggleMinimize, toggleChat } = useChatLayoutStore();
  const [showModeDialog, setShowModeDialog] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center justify-between p-4 border-b bg-background',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowModeDialog(true)}
          className="text-sm font-medium"
        >
          {currentMode}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMinimize}
          className="h-8 w-8"
        >
          {isMinimized ? (
            <Maximize2 className="h-4 w-4" />
          ) : (
            <Minimize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ModeSelectionDialog
        open={showModeDialog}
        onOpenChange={setShowModeDialog}
        onCreateSession={(mode: ChatMode, providerId: string) => {
          setCurrentMode(mode, providerId);
          setShowModeDialog(false);
        }}
      />
    </motion.div>
  );
};
