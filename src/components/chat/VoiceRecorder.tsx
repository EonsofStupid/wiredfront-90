
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useMicrophonePermission } from '@/hooks/useMicrophonePermission';
import { VoiceRecordingDialog } from './VoiceRecordingDialog';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

export function VoiceRecorder({ onTranscription, isProcessing }: VoiceRecorderProps) {
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const { permissionState, requestPermission, isGranted, isDenied } = useMicrophonePermission();

  // Request permission on first click if not already requested
  const handleInitialClick = async () => {
    if (!hasRequestedPermission && permissionState === 'prompt') {
      setHasRequestedPermission(true);
      
      toast.info(
        'Microphone access is needed for voice recording', 
        { 
          duration: 4000,
          className: 'glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20'
        }
      );
      
      const granted = await requestPermission();
      
      if (granted) {
        setIsRecordingDialogOpen(true);
      }
    } else if (isGranted) {
      setIsRecordingDialogOpen(true);
    } else if (isDenied) {
      toast.error(
        'Microphone access is blocked. Please enable it in your browser settings.', 
        { duration: 5000 }
      );
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    if (text.trim()) {
      onTranscription(text);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${isDenied ? 'opacity-50' : ''}`}
            onClick={handleInitialClick}
            disabled={isProcessing || isDenied}
            aria-label="Voice recording"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isDenied ? (
              <MicOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isDenied 
            ? 'Microphone access denied' 
            : 'Record voice message'
          }
        </TooltipContent>
      </Tooltip>

      <VoiceRecordingDialog
        isOpen={isRecordingDialogOpen}
        onClose={() => setIsRecordingDialogOpen(false)}
        onTranscriptionComplete={handleTranscriptionComplete}
        isProcessing={isProcessing}
      />
    </>
  );
}
