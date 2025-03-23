import { Button } from "@/components/ui/button";
import { AlertCircle, Mic, Square } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ElevenLabsVoiceButtonProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

export function ElevenLabsVoiceButton({
  onTranscription,
  isProcessing = false,
}: ElevenLabsVoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks(chunks);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: audioBlob,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const data = await response.json();
          onTranscription(data.transcript);
          toast.success("Voice transcription completed");
        } catch (error) {
          setIsError(true);
          setErrorMessage(
            error instanceof Error ? error.message : "Transcription failed"
          );
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      setIsError(true);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to access microphone"
      );
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);

  const handleClick = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

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
      className="relative h-[var(--chat-input-height)] border border-[var(--chat-elevenlabs-border)] bg-[var(--chat-elevenlabs-bg)]/50"
      title="Use ElevenLabs for high-accuracy transcription"
      data-testid="elevenlabs-voice-button"
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4 text-[var(--chat-elevenlabs-text)]" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--chat-elevenlabs-text)] animate-pulse" />
        </>
      ) : (
        <Mic className="h-4 w-4 text-[var(--chat-elevenlabs-text)]" />
      )}
    </Button>
  );
}
