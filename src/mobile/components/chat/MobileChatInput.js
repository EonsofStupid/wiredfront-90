import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
/**
 * Mobile-optimized chat input with voice dictation support
 */
export const MobileChatInput = () => {
    const [message, setMessage] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim())
            return;
        // TODO: Connect to actual chat functionality
        console.log("Sending message:", message);
        setMessage("");
    };
    return (_jsx("form", { onSubmit: handleSubmit, className: "border-t border-neon-blue/20 p-3 bg-dark-lighter/80 backdrop-blur-md", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", "aria-label": "Voice input", children: _jsx(Mic, { className: "h-5 w-5" }) }), _jsx(Input, { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Message AI Assistant...", className: "flex-1 bg-black/30 border-neon-blue/30 text-white" }), _jsx(Button, { type: "submit", disabled: !message.trim(), className: "bg-gradient-to-r from-neon-blue to-neon-blue/70 text-white h-10 w-10 p-0", "aria-label": "Send message", children: _jsx(Send, { className: "h-5 w-5" }) })] }) }));
};
