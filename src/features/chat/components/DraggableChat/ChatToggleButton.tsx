
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

interface ChatToggleButtonProps {
  className?: string;
  onClick?: () => void;
}

export function ChatToggleButton({ className, onClick }: ChatToggleButtonProps) {
  const { toggleChat, isOpen } = useChatStore();

  const handleClick = () => {
    toggleChat();
    onClick?.();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed h-12 w-12 rounded-full shadow-md transition-all duration-300',
        'border border-neon-blue/30 bg-black/40 text-neon-blue',
        'hover:bg-neon-blue/20 hover:text-white hover:scale-110',
        'focus:ring-2 focus:ring-neon-blue/50 focus:ring-offset-2',
        'z-[var(--z-chat)]',
        'bottom-4 right-4',
        isOpen && 'hidden',
        className
      )}
      onClick={handleClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
