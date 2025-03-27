import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, AlertCircle } from "lucide-react";
import { useVoiceRecognition } from '@/components/chat/features/voice-to-text/hooks/useVoiceRecognition';
import { toast } from "sonner";

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceToTextButton({ onTranscription, isProcessing }: VoiceToTextButtonProps) {
  const {
    isListening,
    isError,
    errorMessage,
    startListening,
    stopListening
  } = useVoiceRecognition((text) => {
    onTranscription(text);
    toast.success('Voice transcription completed');
  });

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (isError) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-[var(--chat-input-height)]"
        onClick={() => toast.error(errorMessage || 'Voice recognition error')}
        title={errorMessage || 'Voice recognition error'}
      >
        <AlertCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative chat-cyber-border h-[var(--chat-input-height)]"
      onClick={handleClick}
      disabled={isProcessing}
      data-testid="voice-to-text-button"
    >
      {isListening ? (
        <>
          <Square className="h-4 w-4 text-red-500" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
