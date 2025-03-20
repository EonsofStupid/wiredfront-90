import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
export const MessageSkeleton = ({ role = 'assistant', lines = 3, className }) => {
    const isUser = role === 'user';
    return (_jsxs("div", { className: cn('flex flex-col gap-2 p-4 rounded-lg max-w-[85%] animate-pulse', isUser ? 'chat-message-user ml-auto' : 'chat-message-assistant', className), children: [_jsxs("div", { className: "flex items-center gap-2", children: [!isUser && _jsx(Skeleton, { className: "h-6 w-6 rounded-full" }), _jsx(Skeleton, { className: "h-4 w-24" })] }), _jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map((_, i) => (_jsx(Skeleton, { className: cn('h-4', i === lines - 1 && lines > 1 ? 'w-[70%]' : 'w-full') }, i))) })] }));
};
