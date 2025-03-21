import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatMessageStore } from '@/features/chat/store/messageStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mic, Send } from 'lucide-react';
import React from 'react';

interface ChatInputAreaProps {
  className?: string;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({ className }) => {
  const [message, setMessage] = React.useState('');
  const { addMessage } = useChatMessageStore();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addMessage({
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    });

    setMessage('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn(
        'flex items-end gap-2 p-4 border-t bg-background',
        className
      )}
    >
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[60px] max-h-[200px] pr-12"
          rows={1}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 bottom-2 h-8 w-8"
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim()}
        className="h-10 w-10"
      >
        <Send className="h-5 w-5" />
      </Button>
    </motion.form>
  );
};
