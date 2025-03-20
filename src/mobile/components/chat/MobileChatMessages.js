import { jsx as _jsx } from "react/jsx-runtime";
import { ScrollArea } from "@/components/ui/scroll-area";
/**
 * Mobile-optimized chat messages display with performance optimizations
 */
export const MobileChatMessages = () => {
    // Placeholder messages for now
    const messages = [
        { id: '1', content: 'Hello! How can I help you with your project today?', role: 'assistant' },
        { id: '2', content: 'I need help optimizing performance on mobile', role: 'user' },
        { id: '3', content: 'I can help with that. Mobile performance optimization involves several strategies...', role: 'assistant' }
    ];
    return (_jsx(ScrollArea, { className: "flex-1 p-3", children: _jsx("div", { className: "space-y-3", children: messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-[80%] rounded-lg px-3 py-2 ${msg.role === 'user'
                        ? 'bg-neon-blue/20 text-white ml-auto'
                        : 'bg-dark-lighter text-white'}`, children: _jsx("p", { className: "text-sm", children: msg.content }) }) }, msg.id))) }) }));
};
