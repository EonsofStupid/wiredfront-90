
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, SendIcon, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { VoiceToTextButton } from '../features/voice-to-text/VoiceToTextButton';
import { useVoiceRecognition } from '../features/voice-to-text/useVoiceRecognition';
import { ElevenLabsVoiceButton } from '../features/voice-chat/ElevenLabsVoiceButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import '../styles/wfpulse-theme.css';

type ChatInputModuleProps = {
  className?: string;
  placeholder?: string;
  onSend?: (message: string) => void;
};

export const ChatInputModule = ({ 
  className = '',
  placeholder = 'Type a message...',
  onSend
}: ChatInputModuleProps) => {
  const { userInput, setUserInput, isWaitingForResponse } = useChatStore();
  const { sendMessage, isLoading } = useMessageAPI();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isEnabled } = useFeatureFlags();
  const [isElevenLabsActive, setIsElevenLabsActive] = useState(false);
  
  const handleVoiceTranscription = (text: string) => {
    setUserInput(text);
  };
  
  const { isListening, startListening, stopListening } = useVoiceRecognition(handleVoiceTranscription);
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || isWaitingForResponse) return;
    
    const message = userInput.trim();
    setUserInput(''); // Clear input immediately for better UX
    
    if (onSend) {
      onSend(message);
    } else {
      await sendMessage(message);
    }
    
    // Focus back on textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle voice button click
  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Handle ElevenLabs voice toggle
  const toggleElevenLabsVoice = () => {
    setIsElevenLabsActive(!isElevenLabsActive);
    // Implement ElevenLabs integration here
  };
  
  // Auto-resize textarea
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  return (
    <div className={`flex items-end gap-2 p-2 bg-background border-t border-white/10 ${className}`}>
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          className="min-h-[40px] max-h-[200px] py-2 pr-10 resize-none bg-black/30 border-white/10 focus:border-neon-blue/30 transition-all duration-200"
          disabled={isWaitingForResponse || isLoading}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                className="absolute right-2 bottom-2 h-7 w-7 text-white/40 hover:text-neon-pink transition-colors duration-200"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        {isEnabled('voice') && (
          <VoiceToTextButton 
            isListening={isListening}
            onClick={handleVoiceButtonClick}
          />
        )}
        
        {isEnabled('elevenLabsVoice') && (
          <ElevenLabsVoiceButton 
            isActive={isElevenLabsActive}
            onClick={toggleElevenLabsVoice}
          />
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isWaitingForResponse || isLoading}
                size="icon"
                className="h-10 w-10 rounded-full p-0 bg-gradient-to-r from-neon-blue to-neon-blue/70 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {isWaitingForResponse || isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                )}
                {/* Cyberpunk glow effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 blur-lg"></span>
                {/* Neon border effect */}
                <span className="absolute inset-0 border border-neon-blue rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-80 transition-opacity duration-300"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Send message (Enter)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center mt-1 text-white/30 -mb-4">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInputModule;
