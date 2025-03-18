
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Paperclip, Sparkles, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isElevenLabsRecording, setIsElevenLabsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isEnabled } = useFeatureFlags();
  
  const showVoice = isEnabled('voice');
  const showElevenLabs = isEnabled('elevenLabsVoice');
  
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
  
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };
  
  const toggleElevenLabsVoice = () => {
    setIsElevenLabsRecording(!isElevenLabsRecording);
    // Add ElevenLabs voice chat logic here
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
            className="w-full bg-black/30 border-white/10 focus:border-neon-blue/30 resize-none py-2 pr-12 max-h-24 text-sm transition-all duration-200"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-white/40 hover:text-neon-pink transition-colors duration-200"
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
        </div>
        
        <div className="flex items-center space-x-2">
          {showVoice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleVoiceRecording}
                    className={`h-9 w-9 rounded-full bg-black/20 border transition-all duration-300 ${
                      isRecording 
                        ? "border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-white animate-pulse" 
                        : "border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white"
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Convert speech to text (Built-in)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {showElevenLabs && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={toggleElevenLabsVoice}
                    className={`h-9 w-9 rounded-full bg-black/20 border transition-all duration-300 ${
                      isElevenLabsRecording 
                        ? "border-blue-500/50 text-blue-500 hover:bg-blue-500/20 hover:text-white animate-pulse" 
                        : "border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20 hover:text-white"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>AI Voice Chat (ElevenLabs)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit"
                  disabled={!input.trim()}
                  className="h-9 w-9 rounded-full p-0 bg-gradient-to-r from-neon-blue to-neon-blue/70 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <Send className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform duration-200" />
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
      </div>
      
      <div className="text-[10px] text-right mt-1 text-white/30">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInputArea;
