import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

interface ChatToggleButtonProps {
  className?: string;
}

export function ChatToggleButton({ className }: ChatToggleButtonProps) {
  const { toggleChat, isOpen } = useChatStore();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-md',
        isOpen && 'hidden',
        className
      )}
      onClick={toggleChat}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
