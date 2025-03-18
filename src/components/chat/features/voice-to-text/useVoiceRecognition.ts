
import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  isError: boolean;
  errorMessage: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecognition = (
  onTranscribe?: (transcript: string) => void,
  options: VoiceRecognitionOptions = {}
): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Reference to SpeechRecognition instance
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize SpeechRecognition on mount
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      
      // Configure recognition
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? true;
      recognition.lang = options.lang ?? 'en-US';
      
      // Set up event handlers
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          if (onTranscribe) {
            onTranscribe(finalTranscript);
          }
        }
        
        setInterimTranscript(interimTranscript);
      };
      
      recognition.onerror = (event) => {
        setIsError(true);
        setErrorMessage(event.error);
        console.error('Speech recognition error:', event.error);
        
        // Auto-stop on error
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setIsError(true);
      setErrorMessage('Speech recognition not supported in this browser');
      console.error('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [options.continuous, options.interimResults, options.lang, onTranscribe]);
  
  const startListening = useCallback(() => {
    if (!isSupported) {
      setIsError(true);
      setErrorMessage('Speech recognition not supported');
      return;
    }
    
    setIsError(false);
    setErrorMessage('');
    
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsError(true);
      setErrorMessage('Failed to start speech recognition');
    }
  }, [isSupported]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);
  
  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    isError,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript
  };
};
