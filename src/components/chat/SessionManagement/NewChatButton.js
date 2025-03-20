import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeSelectionDialog } from './ModeSelectionDialog';
import { useSessionManager } from '@/hooks/sessions/useSessionManager';
export function NewChatButton({ variant = "default", fullWidth = false }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { createSession } = useSessionManager();
    const handleCreateWithMode = async (mode, providerId) => {
        await createSession({
            title: `New ${mode.charAt(0).toUpperCase() + mode.slice(1)} Chat`,
            metadata: {
                mode,
                providerId
            }
        });
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: variant, className: `flex items-center gap-2 ${fullWidth ? 'w-full justify-start' : ''}`, onClick: () => setIsDialogOpen(true), children: [_jsx(PlusCircle, { className: "h-4 w-4" }), _jsx("span", { children: "New Chat" })] }), _jsx(ModeSelectionDialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, onCreateSession: handleCreateWithMode })] }));
}
