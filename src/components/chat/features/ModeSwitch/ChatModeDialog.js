import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChatMode } from '../../providers/ChatModeProvider';
import { ModeCard } from './ModeCard';
import { Code, Image, MessageSquare, GraduationCap, PlaneLanding } from 'lucide-react';
import { useChatStore } from '../../store';
import { validateChatMode } from '@/utils/validation/chatTypes';
export function ChatModeDialog({ open, onOpenChange, onModeSelect }) {
    const { currentMode, setMode } = useChatMode();
    const { availableProviders } = useChatStore();
    const handleModeSelect = (newMode, providerId) => {
        // Validate the mode
        const validMode = validateChatMode(newMode, { fallback: 'chat' });
        // Close the dialog
        onOpenChange(false);
        // Update the mode in the provider
        setMode(validMode);
        // Call the onModeSelect callback to update related state
        onModeSelect(validMode, providerId);
    };
    // Find the appropriate provider for a given mode
    const getProviderForMode = (mode) => {
        if (mode === 'image') {
            return availableProviders.find(p => p.category === 'image')?.id || '';
        }
        return availableProviders.find(p => p.category === 'chat')?.id || '';
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-black/80 border-purple-500/50 text-white backdrop-blur-md cyber-bg", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-center text-neon-blue", children: "Select Chat Mode" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-4", children: [_jsx(ModeCard, { title: "Chat", description: "General assistance", icon: _jsx(MessageSquare, { className: "h-8 w-8 text-neon-blue" }), isActive: currentMode === 'chat', providerId: getProviderForMode('chat'), onSelect: () => handleModeSelect('chat', getProviderForMode('chat')) }), _jsx(ModeCard, { title: "Developer", description: "Code assistance", icon: _jsx(Code, { className: "h-8 w-8 text-neon-green" }), isActive: currentMode === 'dev', providerId: getProviderForMode('dev'), onSelect: () => handleModeSelect('dev', getProviderForMode('dev')) }), _jsx(ModeCard, { title: "Image", description: "Generate images", icon: _jsx(Image, { className: "h-8 w-8 text-neon-pink" }), isActive: currentMode === 'image', providerId: getProviderForMode('image'), onSelect: () => handleModeSelect('image', getProviderForMode('image')) }), _jsx(ModeCard, { title: "Training", description: "Learn and practice", icon: _jsx(GraduationCap, { className: "h-8 w-8 text-orange-400" }), isActive: currentMode === 'training', providerId: getProviderForMode('training'), onSelect: () => handleModeSelect('training', getProviderForMode('training')) }), _jsx(ModeCard, { title: "Planning", description: "Architecture planning", icon: _jsx(PlaneLanding, { className: "h-8 w-8 text-cyan-400" }), isActive: currentMode === 'planning', providerId: getProviderForMode('planning'), onSelect: () => handleModeSelect('planning', getProviderForMode('planning')) })] })] }) }));
}
