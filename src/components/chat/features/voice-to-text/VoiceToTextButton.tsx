import { Button } from "@/components/ui/button";
import { AlertCircle, Mic, Square } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

// Extend the built-in SpeechRecognition interface
interface WebkitSpeechRecognition extends SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): WebkitSpeechRecognition;
    };
  }
}

export function VoiceToTextButton({
  onTranscription,
  isProcessing = false,
}: VoiceToTextButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognition, setRecognition] =
    useState<WebkitSpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscription(transcript);
        setIsListening(false);
        toast.success("Voice transcription completed");
      };

      recognition.onerror = (event) => {
        setIsError(true);
        setErrorMessage(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      setIsError(true);
      setErrorMessage("Speech recognition is not supported in your browser");
    }
  }, [onTranscription]);

  const handleClick = useCallback(() => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setIsError(false);
      setErrorMessage(null);
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition]);

  if (isError) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-[var(--chat-notification-text)] hover:text-[var(--chat-notification-text)]/90 hover:bg-[var(--chat-notification-background)] h-[var(--chat-input-height)]"
        onClick={() => toast.error(errorMessage || "Voice recognition error")}
        title={errorMessage || "Voice recognition error"}
      >
        <AlertCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isProcessing}
      className="relative h-[var(--chat-input-height)] border border-[var(--chat-knowledge-border)] bg-[var(--chat-knowledge-bg)]/50"
      title="Use browser's speech recognition"
      data-testid="voice-to-text-button"
    >
      {isListening ? (
        <>
          <Square className="h-4 w-4 text-[var(--chat-notification-text)]" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--chat-notification-text)] animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4 text-[var(--chat-knowledge-text)]" />
      )}
    </Button>
  );
}
