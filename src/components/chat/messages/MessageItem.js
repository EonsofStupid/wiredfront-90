import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { chatLayoutStateAtom } from '@/stores/ui/chat/layout/atoms';
import { useAtom } from 'jotai';
export const MessageItem = ({ message, className }) => {
    const [layout] = useAtom(chatLayoutStateAtom);
    const isUser = message.role === 'user';
    return (_jsx("div", { className: cn('flex w-full gap-2 p-2', isUser ? 'justify-end' : 'justify-start', className), children: _jsxs("div", { className: cn('max-w-[80%] rounded-lg p-3', 'transition-all duration-[var(--chat-transition-normal)]', isUser
                ? 'bg-[var(--chat-accent-color)] text-white'
                : 'bg-[var(--chat-bg-secondary)] text-[var(--chat-text-primary)]', layout.uiPreferences.fontSize === 'small' && 'text-sm', layout.uiPreferences.fontSize === 'large' && 'text-lg'), children: [_jsx("div", { className: "whitespace-pre-wrap break-words", children: message.content }), layout.uiPreferences.showTimestamps && (_jsx("div", { className: "mt-1 text-xs opacity-70", children: new Date(message.timestamp).toLocaleTimeString() }))] }) }));
};
