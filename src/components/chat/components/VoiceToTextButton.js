import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
export const VoiceToTextButton = ({ onVoiceCapture }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState(null);
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
        }
        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, []);
    const toggleRecording = () => {
        if (!recognition) {
            toast.error('Speech recognition is not supported in your browser');
            return;
        }
        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        }
        else {
            try {
                recognition.start();
                setIsRecording(true);
                toast.info('Listening...');
            }
            catch (error) {
                console.error('Failed to start speech recognition:', error);
                toast.error('Failed to start speech recognition');
            }
        }
    };
    return (_jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: toggleRecording, className: `h-8 w-8 rounded-full ${isRecording ? 'bg-red-500/20 text-red-500' : ''}`, "aria-label": isRecording ? 'Stop recording' : 'Start recording', children: isRecording ? (_jsx(MicOff, { className: "h-4 w-4" })) : (_jsx(Mic, { className: "h-4 w-4" })) }));
};
