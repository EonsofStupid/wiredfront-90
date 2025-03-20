import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChatManager } from '@/components/chat/ChatManager';
export default function ChatPage() {
    return (_jsxs("div", { className: "container py-6", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Chat" }), _jsx(ChatManager, {})] }));
}
