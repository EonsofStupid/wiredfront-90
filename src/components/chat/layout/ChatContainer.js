import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { chatLayoutStateAtom } from '@/stores/ui/chat/layout/atoms';
import { useAtom } from 'jotai';
export const ChatContainer = ({ children, className }) => {
    const [layout] = useAtom(chatLayoutStateAtom);
    return (_jsx("div", { className: cn('flex flex-col h-full w-full bg-[var(--chat-bg-primary)] text-[var(--chat-text-primary)]', 'transition-all duration-[var(--chat-transition-normal)]', layout.isMinimized ? 'rounded-lg shadow-lg' : 'rounded-none shadow-none', className), style: {
            transform: `scale(${layout.scale})`,
            transformOrigin: 'top left'
        }, children: children }));
};
