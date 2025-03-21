import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatMode } from '@/hooks/chat/useChatMode';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { cn } from '@/lib/utils';
import { Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { VoiceInput } from './VoiceInput';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInputArea({
  onSendMessage,
  disabled = false,
  className
}: ChatInputAreaProps) {
  const [input, setInput] = useState('');
  const { currentMode } = useChatMode();
  const { isEnabled } = useFeatureFlags();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const showVoice = isEnabled('voice_input');

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Handle keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("p-4 border-t border-purple-500/50", className)}>
      <div className="relative">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message in ${currentMode} mode...`}
          disabled={disabled}
          className={cn(
            "min-h-[44px] max-h-[200px] w-full",
            "bg-black/40 border-purple-500/30",
            "text-white placeholder:text-white/40",
            "focus:border-purple-500/50 focus:ring-purple-500/20",
            "resize-none pr-24"
          )}
        />

        <div className="absolute right-2 bottom-2 flex items-center space-x-2">
          {showVoice && (
            <VoiceInput
              onVoiceCapture={(text) => {
                setInput(text);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              disabled={disabled}
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full",
              "bg-black/20 border-indigo-400/30",
              "text-indigo-400 hover:bg-indigo-400/20 hover:text-white",
              "transition-colors duration-200"
            )}
            disabled={disabled}
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            className={cn(
              "h-9 w-9 rounded-full p-0",
              "bg-gradient-to-r from-neon-blue to-neon-blue/70",
              "hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-opacity duration-200"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-[10px] text-right mt-1 text-white/30">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}
