import { Button } from "@/components/ui/button";
import { AlertCircle, Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { useVoiceRecognition } from "./useVoiceRecognition";

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceToTextButton({
  onTranscription,
  isProcessing,
}: VoiceToTextButtonProps) {
  const { isListening, isError, errorMessage, startListening, stopListening } =
    useVoiceRecognition((text) => {
      onTranscription(text);
      toast.success("Voice transcription completed");
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
