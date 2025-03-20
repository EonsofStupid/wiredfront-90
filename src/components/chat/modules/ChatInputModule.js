import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useMessageAPI } from '@/hooks/chat/useMessageAPI';
import { VoiceToTextButton } from '../features/voice-to-text/VoiceToTextButton';
import { useVoiceRecognition } from '../features/voice-to-text/useVoiceRecognition';
export const ChatInputModule = ({ className = '', placeholder = 'Type a message...', onSend }) => {
    const { userInput, setUserInput, isWaitingForResponse } = useChatStore();
    const { sendMessage, isLoading } = useMessageAPI();
    const textareaRef = useRef(null);
    const handleVoiceTranscription = (text) => {
        setUserInput(text);
    };
    const { isListening, isError, errorMessage, startListening, stopListening } = useVoiceRecognition(handleVoiceTranscription);
    const handleSendMessage = async () => {
        if (!userInput.trim() || isWaitingForResponse)
            return;
        const message = userInput.trim();
        setUserInput(''); // Clear input immediately for better UX
        if (onSend) {
            onSend(message);
        }
        else {
            await sendMessage(message);
        }
        // Focus back on textarea after sending
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };
    const handleKeyDown = (e) => {
        // Send message on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    // Handle voice button click
    const handleVoiceButtonClick = () => {
        if (isListening) {
            stopListening();
        }
        else {
            startListening();
        }
    };
    // Auto-resize textarea
    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    return (_jsxs("div", { className: `flex items-end gap-2 p-2 bg-background border-t ${className}`, children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Textarea, { ref: textareaRef, value: userInput, onChange: (e) => setUserInput(e.target.value), onKeyDown: handleKeyDown, onInput: handleInput, placeholder: placeholder, className: "min-h-[40px] max-h-[200px] py-2 pr-10 resize-none", disabled: isWaitingForResponse || isLoading }), _jsx(VoiceToTextButton, { isListening: isListening, onClick: handleVoiceButtonClick, className: "absolute right-2 bottom-2" })] }), _jsx(Button, { onClick: handleSendMessage, disabled: !userInput.trim() || isWaitingForResponse || isLoading, size: "icon", className: "h-10 w-10", children: isWaitingForResponse || isLoading ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin" })) : (_jsx(SendIcon, { className: "h-4 w-4" })) })] }));
};
export default ChatInputModule;
