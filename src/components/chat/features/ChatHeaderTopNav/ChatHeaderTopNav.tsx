
import React, { useState } from 'react';
import { Code, Menu, Search, GitBranch, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { logger } from '@/services/chat/LoggingService';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import './styles.css';

export function ChatHeaderTopNav() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    logger.info('Top nav menu toggled', { isVisible: !isMenuVisible });
  };

  // Sample session stats - in a real app, these would come from a store or context
  const sessionStats = {
    messagesCount: 42,
    tokenCount: 3845,
    sessionDuration: '00:32:15',
    responseTime: '1.2s'
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="chat-header-top-nav-button font-mono text-xs font-bold bg-black/20 border border-[#1EAEDB]/30 hover:bg-black/40 hover:border-[#1EAEDB]/50"
              aria-label="Dev Mode"
            >
              <Code className="h-3 w-3 mr-1 text-[#1EAEDB]" />
              <span className="text-[#1EAEDB] tracking-wider">DEV</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent 
            className="w-64 backdrop-blur-xl bg-black/80 border border-[#1EAEDB]/30 text-[#1EAEDB] shadow-[0_0_15px_rgba(30,174,219,0.3)]"
            side="bottom"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1EAEDB]/20 pb-2">
                <span className="font-bold text-white">DEV MODE</span>
                <span className="text-xs bg-[#1EAEDB]/10 px-2 py-0.5 rounded-sm">ACTIVE</span>
              </div>
              
              <div className="space-y-1.5">
                <StatsItem label="Messages" value={sessionStats.messagesCount.toString()} />
                <StatsItem label="Tokens" value={sessionStats.tokenCount.toString()} />
                <StatsItem label="Duration" value={sessionStats.sessionDuration} />
                <StatsItem label="Response" value={sessionStats.responseTime} />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
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
              <NavItem icon={<Bell className="h-4 w-4" />} label="Notifications" onClick={() => logger.info('Notifications clicked')} />
              <NavItem icon={<GitBranch className="h-4 w-4" />} label="GitHub Status" onClick={() => logger.info('GitHub Status clicked')} />
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

interface StatsItemProps {
  label: string;
  value: string;
}

function StatsItem({ label, value }: StatsItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[#1EAEDB]/80">{label}</span>
      <span className="text-sm font-mono">{value}</span>
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
