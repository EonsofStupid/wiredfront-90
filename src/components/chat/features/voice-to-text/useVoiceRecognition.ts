
import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/services/chat/LoggingService';

interface VoiceRecognitionState {
  isListening: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useVoiceRecognition = (onTranscription: (text: string) => void) => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    isError: false,
    errorMessage: null,
  });

  const recognition = useCallback(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }
    const instance = new Recognition();
    instance.continuous = false;
    instance.interimResults = false;
    instance.lang = 'en-US';
    return instance;
  }, []);

  useEffect(() => {
    let recognitionInstance: SpeechRecognition | null = null;

    const cleanup = () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
        recognitionInstance = null;
      }
    };

    if (state.isListening) {
      try {
        recognitionInstance = recognition();
        
        recognitionInstance.onstart = () => {
          logger.info('Voice recognition started');
          setState(prev => ({ ...prev, isError: false, errorMessage: null }));
        };

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          logger.info('Voice transcription received', { transcript });
          onTranscription(transcript);
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionInstance.onerror = (event) => {
          logger.error('Voice recognition error', { error: event.error });
          setState(prev => ({
            ...prev,
            isListening: false,
            isError: true,
            errorMessage: event.error
          }));
        };

        recognitionInstance.onend = () => {
          logger.info('Voice recognition ended');
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognitionInstance.start();
      } catch (error) {
        logger.error('Failed to initialize voice recognition', { error });
        setState(prev => ({
          ...prev,
          isListening: false,
          isError: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    }

    return cleanup;
  }, [state.isListening, recognition, onTranscription]);

  const startListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: true }));
  }, []);

  const stopListening = useCallback(() => {
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening
  };
};
