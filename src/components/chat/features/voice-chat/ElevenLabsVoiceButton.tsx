
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, HeadphonesOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface ElevenLabsVoiceButtonProps {
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const ElevenLabsVoiceButton: React.FC<ElevenLabsVoiceButtonProps> = ({ 
  isActive, 
  onClick,
  className
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClick}
            className={cn(
              "h-9 w-9 rounded-full bg-black/20 border transition-all duration-300",
              isActive 
                ? "border-blue-500/50 text-blue-500 hover:bg-blue-500/20 hover:text-white" 
                : "border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20 hover:text-white",
              isActive && "neon-pulse",
              className
            )}
            aria-label={isActive ? "Stop voice chat" : "Start voice chat"}
          >
            {isActive ? (
              <HeadphonesOff className="h-4 w-4" />
            ) : (
              <Headphones className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>AI Voice Chat (ElevenLabs)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ElevenLabsVoiceButton;
