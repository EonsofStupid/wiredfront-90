import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logger } from '@/services/chat/LoggingService';
import { useChatCombined } from '@/stores/features/chat';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BookOpen, Code, FileSearch, GitBranch, Image, Maximize2, Menu, Minimize2, Pin, PinOff, Search, X, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface ChatHeaderProps {
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function NavItem({ icon, label, onClick }: NavItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full px-4 py-2 text-sm flex items-center gap-2",
          "text-white/80 hover:text-white hover:bg-white/10",
          "transition-colors duration-200"
        )}
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  );
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
  const {
    currentMode,
    isMinimized,
    docked,
    toggleMinimize,
    toggleOpen,
    toggleDocked,
    toggleSidebar
  } = useChatCombined();

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Convert mode to display title
  const getDisplayTitle = () => {
    switch (currentMode) {
      case 'dev': return 'Developer Assistant';
      case 'image': return 'Image Generator';
      case 'training': return 'Training Mode';
      case 'code': return 'Code Assistant';
      case 'planning': return 'Project Planning';
      default: return 'AI Assistant';
    }
  };

  // Get icon for current mode
  const getModeIcon = () => {
    switch (currentMode) {
      case 'dev': return <Code className="h-4 w-4 text-cyan-400" />;
      case 'image': return <Image className="h-4 w-4 text-pink-400" />;
      case 'training': return <BookOpen className="h-4 w-4 text-purple-400" />;
      default: return <Zap className="h-4 w-4 text-cyan-400" />;
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    logger.info('Top nav menu toggled', { isVisible: !isMenuVisible });
  };

  return (
    <div className={cn("chat-header h-12 px-3 flex items-center justify-between cyber-bg cyber-border", className)}>
      <div className="flex items-center gap-2">
        <div className="relative chat-header-top-nav">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMenu}
            className="hover:bg-white/10 chat-header-top-nav-button"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>

          <AnimatePresence>
            {isMenuVisible && (
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute top-full left-0 w-48 mt-2 py-2",
                  "bg-chat-knowledge-bg border border-chat-knowledge-border rounded-md shadow-lg",
                  "backdrop-blur-md z-50"
                )}
              >
                <ul className="space-y-1">
                  <NavItem icon={<Search className="h-4 w-4" />} label="RAG Search" onClick={() => logger.info('RAG Search clicked')} />
                  <NavItem icon={<FileSearch className="h-4 w-4" />} label="Vector Database" onClick={() => logger.info('Vector Database clicked')} />
                  <NavItem icon={<Bell className="h-4 w-4" />} label="Notifications" onClick={() => logger.info('Notifications clicked')} />
                  <NavItem icon={<GitBranch className="h-4 w-4" />} label="GitHub Status" onClick={() => logger.info('GitHub Status clicked')} />
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

        <span className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium">AI Assistant</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={toggleDocked}
          aria-label={docked ? "Undock chat" : "Dock chat"}
        >
          {docked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="chat-control-button h-8 w-8 text-red-400 hover:bg-red-400/10"
          onClick={toggleOpen}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
