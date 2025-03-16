
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Mic, MicOff } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { VoiceToTextButton } from '../components/VoiceToTextButton';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatInputModuleProps {
  onSubmit?: (message: Message) => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const ChatInputModule: React.FC<ChatInputModuleProps> = ({
  onSubmit,
  placeholder = 'Type a message...',
  autoFocus = false,
  disabled = false,
}) => {
  const { userInput, setUserInput, features } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      content: userInput.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
      metadata: {}
    };
    
    onSubmit?.(newMessage);
    setUserInput('');
    
    // Auto-focus the textarea after submission
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording logic
    } else {
      // Stop recording logic
    }
  };

  const handleVoiceInput = (text: string) => {
    setUserInput(prev => prev ? `${prev} ${text}` : text);
    
    // Create speech recognition message
    const speechRecognitionMessage: Message = {
      id: uuidv4(),
      content: text,
      role: 'system',
      timestamp: new Date().toISOString(),
      metadata: {
        type: 'voice-recognition',
        recognized: true
      }
    };
    
    // Log the recognized speech
    console.log('Voice input recognized:', speechRecognitionMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-module mt-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[60px] resize-none pr-10"
            disabled={disabled}
          />
          
          {features.voice && (
            <div className="absolute right-2 bottom-2">
              <VoiceToTextButton onVoiceCapture={handleVoiceInput} />
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={!userInput.trim() || disabled}
          className="h-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
