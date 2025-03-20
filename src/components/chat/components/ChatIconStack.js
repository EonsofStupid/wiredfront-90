import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatStore } from '../store/chatStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, Mic, FileSearch, Brain, Settings } from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
export function ChatIconStack() {
    const { isMinimized } = useChatStore();
    const { isEnabled } = useFeatureFlags();
    if (isMinimized)
        return null;
    const showVoice = isEnabled('voice');
    const showRag = isEnabled('ragSupport');
    return (_jsx("div", { className: "absolute bottom-16 right-4 flex flex-col space-y-2", children: _jsxs(TooltipProvider, { children: [_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full bg-black/40 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 hover:text-white shadow-lg shadow-neon-blue/20", children: _jsx(Command, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "left", children: _jsx("p", { children: "Commands" }) })] }), showVoice && (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full bg-black/40 border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white shadow-lg shadow-neon-pink/20", children: _jsx(Mic, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "left", children: _jsx("p", { children: "Voice Input" }) })] })), showRag && (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full bg-black/40 border border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:text-white shadow-lg shadow-purple-500/20", children: _jsx(FileSearch, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "left", children: _jsx("p", { children: "Search Knowledge" }) })] })), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full bg-black/40 border border-teal-400/30 text-teal-400 hover:bg-teal-400/20 hover:text-white shadow-lg shadow-teal-400/20", children: _jsx(Brain, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "left", children: _jsx("p", { children: "AI Memory" }) })] }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8 rounded-full bg-black/40 border border-gray-400/30 text-gray-400 hover:bg-gray-400/20 hover:text-white shadow-lg shadow-gray-400/20", children: _jsx(Settings, { className: "h-4 w-4" }) }) }), _jsx(TooltipContent, { side: "left", children: _jsx("p", { children: "Chat Settings" }) })] })] }) }));
}
