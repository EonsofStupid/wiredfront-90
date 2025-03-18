
import React from 'react';
import { Mic, StopCircle } from 'lucide-react';

export interface VoiceToTextButtonProps {
  isListening: boolean;
  onClick: () => void;
  className?: string;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ 
  isListening,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/30' 
          : 'text-muted-foreground hover:text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/30 border border-transparent'
      } ${className}`}
      aria-label={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <StopCircle className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </button>
  );
};

export default VoiceToTextButton;
