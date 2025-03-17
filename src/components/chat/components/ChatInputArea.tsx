
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal, Mic, MicOff, Sparkles, Image as ImageIcon, Code } from 'lucide-react';
import { useChatStore } from '../store';
import { toast } from 'sonner';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { features } = useChatStore();
  const [isRecording, setIsRecording] = useState(false);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (!features.voice) {
      toast.error('Voice feature is not enabled');
      return;
    }
    
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info('Voice recording started');
      // In a real implementation, this would start recording
    } else {
      toast.info('Voice recording stopped');
      // In a real implementation, this would stop recording and process the audio
    }
  };

  return (
    <div className="p-3 border-t border-white/10 relative">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea 
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-[120px] bg-black/20 border-white/10 text-white placeholder:text-white/40 pr-12"
            rows={1}
          />
          
          <Button
            className="absolute right-1 bottom-1 h-8 w-8 p-0 bg-chat-neon-purple"
            onClick={handleSend}
            disabled={!message.trim()}
            aria-label="Send message"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
        
        {features.voice && (
          <Button 
            variant="outline" 
            size="icon" 
            className={`h-10 w-10 border-white/10 bg-black/20 ${isRecording ? 'text-red-500' : 'text-white/70'}`}
            onClick={handleVoiceToggle}
            aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
      </div>
      
      <div className="flex justify-center mt-2 space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => setMessage(prev => prev + " Generate creative ideas for...")}
        >
          <Sparkles className="h-3 w-3" />
          <span>Ideas</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => setMessage(prev => prev + " Generate an image of...")}
        >
          <ImageIcon className="h-3 w-3" />
          <span>Image</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1 text-white/60 hover:text-white hover:bg-white/10"
          onClick={() => setMessage(prev => prev + " Write code for...")}
        >
          <Code className="h-3 w-3" />
          <span>Code</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInputArea;
