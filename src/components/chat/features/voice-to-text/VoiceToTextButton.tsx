
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useChatStore } from '../../store/chatStore';

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({ 
  onTranscription,
  isProcessing = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { features } = useChatStore();

  const startRecording = async () => {
    if (!features.voice) {
      toast.error('Voice input is not enabled');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const audioChunks: BlobPart[] = [];
      
      recorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        processAudio(audioBlob);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      });
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast.info('Voice recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      toast.info('Processing voice input...');
    }
  };
  
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Create a form data object to send the audio
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // For now, just simulate a response
      // In a real implementation, you would call an API
      setTimeout(() => {
        const mockTranscription = "This is a simulated voice transcription. Replace with actual API call.";
        onTranscription(mockTranscription);
        toast.success('Voice transcribed successfully');
      }, 1000);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice input');
    }
  };
  
  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  if (!features.voice) {
    return null;
  }
  
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isProcessing}
      onClick={handleToggleRecording}
      className={`h-10 w-10 ${isRecording ? 'text-red-500 bg-red-500/10' : ''}`}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};
