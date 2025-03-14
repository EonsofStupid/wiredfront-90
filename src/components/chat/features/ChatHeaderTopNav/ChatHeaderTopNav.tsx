
import React, { useState } from 'react';
import { Menu, Search, GitBranch, Bell, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/services/chat/LoggingService';

export function ChatHeaderTopNav() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    logger.info('Top nav menu toggled', { isVisible: !isMenuVisible });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="hover:bg-white/10"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

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
  );
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

export default ChatHeaderTopNav;
