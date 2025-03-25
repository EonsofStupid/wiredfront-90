
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from './useVoiceRecognition';

export interface VoiceToTextButtonProps {
  onVoiceInput?: (input: string) => void;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  
  const handleTranscription = (text: string) => {
    if (text && onVoiceInput) {
      onVoiceInput(text);
      setIsListening(false);
    }
  };
  
  const { startListening, stopListening, isError, errorMessage } = useVoiceRecognition(handleTranscription);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleListening}
        disabled={isError}
        aria-label="Toggle voice input"
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      {isError && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};
