
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface VoiceToTextButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ 
  isListening, 
  onClick,
  className
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={cn(
              "rounded-full transition-all duration-300",
              isListening ? "text-red-500 bg-red-500/10" : "text-white/60 hover:text-neon-pink",
              className
            )}
            aria-label={isListening ? "Stop recording" : "Start recording"}
          >
            {isListening ? (
              <MicOff className={cn("h-4 w-4", isListening && "animate-pulse")} />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Convert speech to text (Built-in)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VoiceToTextButton;
