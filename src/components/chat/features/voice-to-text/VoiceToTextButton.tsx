
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
      className={`p-2 rounded-full ${isListening ? 'bg-red-500/20 text-red-500' : 'text-muted-foreground hover:text-primary'} ${className}`}
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
