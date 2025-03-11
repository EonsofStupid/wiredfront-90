
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecordingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceRecordingDialog({
  isOpen,
  onClose,
  onTranscriptionComplete,
  isProcessing
}: VoiceRecordingDialogProps) {
  const [timeLeft, setTimeLeft] = useState(6);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording when dialog opens
  useEffect(() => {
    if (isOpen && !isRecording && !isProcessing) {
      startRecording();
    }
  }, [isOpen, isProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setRecordingError(null);
      setTranscribedText(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = processRecording;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start the countdown timer
      setTimeLeft(6);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
  };

  const processRecording = async () => {
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      if (audioBlob.size === 0) {
        setRecordingError('No audio recorded. Please try again.');
        return;
      }
      
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64Audio = (reader.result as string).split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });
          
          if (error) throw error;
          if (data.error) throw new Error(data.error);
          
          setTranscribedText(data.text);
          onTranscriptionComplete(data.text);
          onClose();
          
        } catch (error) {
          console.error('Transcription error:', error);
          setRecordingError('Failed to transcribe audio. Please try again.');
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing recording:', error);
      setRecordingError('Failed to process recording');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-card sm:max-w-md bg-gradient-to-r from-[#1A1F2C]/80 to-[#1A1F2C]/90 border border-white/10 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-center text-xl">
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin text-[#8B5CF6]" />
                Processing Audio...
              </>
            ) : isRecording ? (
              <>
                <Mic className="h-5 w-5 mr-2 text-[#8B5CF6] animate-pulse" />
                Recording Voice ({timeLeft}s)
              </>
            ) : recordingError ? (
              <>
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Recording Error
              </>
            ) : (
              <>Recording Complete</>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-white/80">
            {isProcessing ? (
              "Transcribing your message..."
            ) : isRecording ? (
              "Speak now. Recording will stop automatically in a few seconds."
            ) : recordingError ? (
              recordingError
            ) : (
              "Processing your recording..."
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center items-center py-4">
          {isRecording && (
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#8B5CF6]/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-[#8B5CF6]/30 rounded-full"></div>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10 h-14 w-14 rounded-full bg-[#8B5CF6] hover:bg-[#7C4DF1] text-white"
                onClick={stopRecording}
              >
                <Square className="h-6 w-6" />
              </Button>
            </div>
          )}
          
          {!isRecording && !isProcessing && recordingError && (
            <Button 
              onClick={startRecording}
              className="bg-[#8B5CF6] hover:bg-[#7C4DF1] text-white"
            >
              Try Again
            </Button>
          )}
          
          {isProcessing && (
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-[#1A1F2C] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#8B5CF6] animate-spin" />
              </div>
            </div>
          )}
        </div>
        
        {transcribedText && !isProcessing && !isRecording && (
          <div className="bg-black/20 p-3 rounded-md text-white/90 text-sm">
            "{transcribedText}"
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
