
import React from 'react';
import { useChatStore } from '../store/chatStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, Mic, FileSearch, Brain, Settings, Palette } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useChatMode } from '../providers/ChatModeProvider';

export function ChatIconStack() {
  const { isMinimized } = useChatStore();
  const { isEnabled } = useFeatureFlags();
  const { mode, setMode } = useChatMode();
  
  if (isMinimized) return null;
  
  const showVoice = isEnabled('voice');
  const showRag = isEnabled('ragSupport');
  
  const handleModeSwitch = () => {
    // Cycle through available modes
    const modes = ['chat', 'dev', 'image', 'training'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };
  
  return (
    <div className="absolute bottom-16 right-4 flex flex-col space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/40 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 hover:text-white shadow-lg shadow-neon-blue/20 transition-all duration-200 hover:scale-110"
            >
              <Command className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Commands</p>
          </TooltipContent>
        </Tooltip>
        
        {showVoice && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white shadow-lg shadow-neon-pink/20 transition-all duration-200 hover:scale-110"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Voice Input</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {showRag && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black/40 border border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:scale-110"
              >
                <FileSearch className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Search Knowledge</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleModeSwitch}
              className="h-8 w-8 rounded-full bg-black/40 border border-teal-400/30 text-teal-400 hover:bg-teal-400/20 hover:text-white shadow-lg shadow-teal-400/20 transition-all duration-200 hover:scale-110"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Change AI mode</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/40 border border-gray-400/30 text-gray-400 hover:bg-gray-400/20 hover:text-white shadow-lg shadow-gray-400/20 transition-all duration-200 hover:scale-110"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Chat Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ChatIconStack;
