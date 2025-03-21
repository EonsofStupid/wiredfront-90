import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Mic, MicOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VoiceInputProps {
  onVoiceCapture: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export function VoiceInput({ onVoiceCapture, className, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Initialize speech recognition if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceCapture(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onVoiceCapture]);

  const toggleRecording = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
        toast.info('Listening...');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.error('Failed to start speech recognition');
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={toggleRecording}
      disabled={disabled}
      className={cn(
        "h-8 w-8 rounded-full transition-colors",
        isRecording && "bg-red-500/20 text-red-500 hover:bg-red-500/30",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
