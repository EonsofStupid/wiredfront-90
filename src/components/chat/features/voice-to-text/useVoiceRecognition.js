import { useState, useCallback, useEffect } from 'react';
export const useVoiceRecognition = (onTranscription) => {
    const [isListening, setIsListening] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    // Configure recognition settings if available
    useEffect(() => {
        if (recognition) {
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                if (event.results[0].isFinal) {
                    onTranscription(transcript);
                }
            };
            recognition.onerror = (event) => {
                setIsError(true);
                setErrorMessage(`Speech recognition error: ${event.error}`);
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            recognition.onend = () => {
                setIsListening(false);
            };
        }
    }, [recognition, onTranscription]);
    const startListening = useCallback(() => {
        setIsError(false);
        setErrorMessage('');
        if (recognition) {
            try {
                recognition.start();
                setIsListening(true);
            }
            catch (error) {
                console.error('Failed to start speech recognition:', error);
                setIsError(true);
                setErrorMessage('Failed to start speech recognition');
            }
        }
        else {
            setIsError(true);
            setErrorMessage('Speech recognition not supported in this browser');
        }
    }, [recognition]);
    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);
    return {
        isListening,
        isError,
        errorMessage,
        startListening,
        stopListening
    };
};
