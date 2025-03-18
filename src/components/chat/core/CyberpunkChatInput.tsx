
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Mic, MicOff, Slash, Image, Code, PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';

interface CyberpunkChatInputProps {
  onSendMessage: (content: string) => void;
  onToggleCommandBar: () => void;
}

const CyberpunkChatInput: React.FC<CyberpunkChatInputProps> = ({
  onSendMessage,
  onToggleCommandBar
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { features } = useChatStore();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      // If message starts with /, treat as command
      if (message.startsWith('/')) {
        handleCommand(message);
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
    }
  };

  const handleCommand = (commandText: string) => {
    // Open command bar if just "/"
    if (commandText === '/') {
      onToggleCommandBar();
      return;
    }

    // For now, just send the command as a message
    // In a full implementation, this would parse and execute commands
    onSendMessage(commandText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Open command bar when slash is pressed and input is empty
    if (e.key === '/' && !message) {
      e.preventDefault();
      onToggleCommandBar();
      return;
    }

    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (!features.voice) {
      return;
    }
    
    setIsRecording(prev => !prev);
    // In a real implementation, this would start/stop voice recording
  };

  return (
    <div className="chat-cyberpunk-input-container">
      <div className="chat-cyberpunk-input-wrapper">
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-input-command-button"
          onClick={onToggleCommandBar}
        >
          <Slash className="h-4 w-4" />
        </Button>
        
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or / for commands..."
          className="chat-cyberpunk-input-textarea"
          rows={1}
        />
        
        <Button
          className="chat-cyberpunk-input-send-button"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="chat-cyberpunk-input-actions">
        {features.voice && (
          <Button
            variant="ghost"
            size="icon"
            className={`chat-cyberpunk-input-action-button ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceToggle}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-input-action-button"
          onClick={() => setMessage(prev => prev + " Generate an image of ")}
        >
          <Image className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-input-action-button"
          onClick={() => setMessage(prev => prev + " Write code for ")}
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-input-action-button"
          onClick={() => setMessage(prev => prev + " Create a new ")}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CyberpunkChatInput;
