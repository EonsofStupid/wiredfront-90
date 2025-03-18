
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isEnabled } = useFeatureFlags();
  
  const showVoice = isEnabled('voice');
  
  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    onSendMessage(input.trim());
    setInput('');
    
    // Focus input after sending
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/20">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message AI..."
            className="w-full bg-black/30 border-white/10 focus:border-neon-blue/30 resize-none py-2 pr-12 max-h-24 text-sm"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="h-7 w-7 text-white/40 hover:text-neon-pink"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showVoice && (
            <Button 
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full bg-black/20 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-black/20 border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20 hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          
          <Button 
            type="submit"
            disabled={!input.trim()}
            className="h-9 w-9 rounded-full p-0 bg-gradient-to-r from-neon-blue to-neon-blue/70 hover:opacity-90"
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
};

export default ChatInputArea;
