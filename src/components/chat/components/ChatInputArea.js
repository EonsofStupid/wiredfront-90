import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useChatMode } from '../providers/ChatModeProvider';
import { cn } from '@/lib/utils';
const ChatInputArea = ({ onSendMessage, disabled = false, className }) => {
    const [input, setInput] = useState('');
    const [rows, setRows] = useState(1);
    const inputRef = useRef(null);
    const { isEnabled } = useFeatureFlags();
    const { currentMode } = useChatMode();
    const showVoice = isEnabled('voice_input');
    useEffect(() => {
        // Focus input when component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    const handleInputChange = (e) => {
        setInput(e.target.value);
        // Adjust rows based on content length
        const lineCount = e.target.value.split('\n').length;
        setRows(Math.min(Math.max(lineCount, 1), 5));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || disabled)
            return;
        onSendMessage(input.trim());
        setInput('');
        setRows(1);
        // Focus input after sending
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const handleKeyDown = (e) => {
        // Send on Enter (without shift)
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    const getPlaceholder = () => {
        switch (currentMode) {
            case 'dev':
                return 'Ask about your code...';
            case 'image':
                return 'Describe an image to generate...';
            case 'training':
                return 'What would you like to learn?';
            case 'planning':
                return 'Describe your project plan...';
            default:
                return 'Message AI...';
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: cn("p-3 border-t border-white/10 bg-black/20", className), children: [_jsxs("div", { className: "flex items-end gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Textarea, { ref: inputRef, value: input, onChange: handleInputChange, onKeyDown: handleKeyDown, placeholder: getPlaceholder(), className: "w-full bg-black/30 border-white/10 focus:border-neon-blue/30 resize-none py-2 pr-12 max-h-24 text-sm", rows: rows, disabled: disabled }), _jsx("div", { className: "absolute right-2 bottom-2", children: _jsx(Button, { type: "button", size: "icon", variant: "ghost", className: "h-7 w-7 text-white/40 hover:text-neon-pink", disabled: disabled, children: _jsx(Paperclip, { className: "h-4 w-4" }) }) })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [showVoice && (_jsx(Button, { type: "button", variant: "outline", size: "icon", className: "h-9 w-9 rounded-full bg-black/20 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white", disabled: disabled, children: _jsx(Mic, { className: "h-4 w-4" }) })), _jsx(Button, { type: "button", variant: "outline", size: "icon", className: "h-9 w-9 rounded-full bg-black/20 border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20 hover:text-white", disabled: disabled, children: _jsx(Sparkles, { className: "h-4 w-4" }) }), _jsx(Button, { type: "submit", disabled: !input.trim() || disabled, className: "h-9 w-9 rounded-full p-0 bg-gradient-to-r from-neon-blue to-neon-blue/70 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { className: "h-4 w-4" }) })] })] }), _jsx("div", { className: "text-[10px] text-right mt-1 text-white/30", children: "Press Enter to send, Shift+Enter for new line" })] }));
};
export default ChatInputArea;
