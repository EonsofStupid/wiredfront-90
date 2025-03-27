
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceToTextButton({ onTranscription, isProcessing }: VoiceToTextButtonProps) {
  const [isListening, setIsListening] = useState(false);
  
  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    try {
      setIsListening(true);
      
      // This is a simplified implementation
      // In a real app, you'd need to handle browser compatibility and permissions
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscription(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        toast.error('Failed to recognize speech');
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition', error);
      toast.error('Failed to start speech recognition');
      setIsListening(false);
    }
  };
  
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={startListening}
      disabled={isListening || isProcessing}
      className="h-10 w-10"
      title={isListening ? "Listening..." : "Speak your message"}
    >
      {isListening ? (
        <Mic className="h-4 w-4 text-red-500 animate-pulse" />
      ) : (
        <MicOff className="h-4 w-4" />
      )}
    </Button>
  );
}
