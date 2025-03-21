import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useChatStore } from '../../store/chatStore';

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { showSidebar } = useChatStore();

  return (
    <motion.div
      className={cn(
        'w-64 bg-background border-r border-border rounded-l-lg overflow-hidden',
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold">Chat History</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {/* Chat history items will go here */}
      </div>
    </motion.div>
  );
}
