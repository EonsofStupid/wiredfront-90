import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from './useVoiceRecognition';

export interface VoiceToTextButtonProps {
  onVoiceInput?: (input: string) => void;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const { startRecognition, stopRecognition, transcript, resetTranscript, isError, errorMessage } = useVoiceRecognition();

  const toggleListening = () => {
    if (isListening) {
      stopRecognition();
      setIsListening(false);
    } else {
      startRecognition();
      setIsListening(true);
    }
  };

  React.useEffect(() => {
    if (transcript && onVoiceInput) {
      onVoiceInput(transcript);
      resetTranscript();
      stopRecognition();
      setIsListening(false);
    }
  }, [transcript, onVoiceInput, resetTranscript, stopRecognition]);

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
