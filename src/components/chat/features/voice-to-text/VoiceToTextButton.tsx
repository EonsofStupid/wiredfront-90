
import React, { useState, useCallback } from 'react';
import { Mic, StopCircle } from 'lucide-react';

export interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isDisabled?: boolean;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ 
  onTranscription,
  isDisabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  
  // Implement the voice recording logic here...
  
  const startRecording = useCallback(() => {
    if (isDisabled) return;
    
    setIsRecording(true);
    // Implement the actual recording logic
    
    // Simulate a transcription for now
    setTimeout(() => {
      setIsRecording(false);
      onTranscription("This is a simulated voice transcription");
    }, 3000);
  }, [isDisabled, onTranscription]);
  
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    // Implement logic to stop recording
  }, []);
  
  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isDisabled}
      className={`p-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary/10'}`}
      aria-label={isRecording ? "Stop recording" : "Start voice input"}
    >
      {isRecording ? (
        <StopCircle className="h-5 w-5 text-white" />
      ) : (
        <Mic className="h-5 w-5 text-primary" />
      )}
    </button>
  );
};
