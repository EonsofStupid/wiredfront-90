import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy, useState } from "react";
import { SessionControls } from "./SessionControls";
import { useSessionManager } from "@/hooks/sessions/useSessionManager";
import { SessionHeader } from "./SessionHeader";
import { useChatStore } from "../store/chatStore";
import { useChatModeStore } from "../store/chatModeStore";
import { Skeleton } from "@/components/ui/skeleton";
import { useErrorBoundary } from "../hooks/useErrorBoundary";
import { ModeSelectionDialog } from "../SessionManagement/ModeSelectionDialog";
// Lazy load SessionList for performance
const SessionList = lazy(() => import("./SessionList").then(mod => ({ default: mod.SessionList })));
const SessionSkeleton = lazy(() => import("./SessionSkeleton"));
export const ChatSidebar = () => {
    const { sessions, currentSessionId, switchSession, createSession, cleanupInactiveSessions, clearSessions, isLoading, } = useSessionManager();
    const { ui } = useChatStore();
    const { currentMode, setCurrentMode } = useChatModeStore();
    const { ErrorBoundary } = useErrorBoundary();
    const [modeDialogOpen, setModeDialogOpen] = useState(false);
    const formattedSessions = sessions.map(session => ({
        id: session.id,
        lastAccessed: new Date(session.last_accessed),
        isActive: session.id === currentSessionId
    }));
    const handleClick = (e) => {
        e.stopPropagation();
    };
    const handleCreateSession = async () => {
        // Open mode selection dialog instead of directly creating a session
        setModeDialogOpen(true);
    };
    // Handler for mode selection and session creation
    const handleCreateWithMode = async (mode, providerId) => {
        // Set the current mode in our global store
        setCurrentMode(mode, providerId);
        // Create a new session with the selected mode
        await createSession({
            title: `New ${mode.charAt(0).toUpperCase() + mode.slice(1)} Chat`,
            metadata: {
                mode,
                providerId
            }
        });
    };
    // Explicit handlers for different deletion operations
    const handleClearOtherSessions = async () => {
        await clearSessions(true); // Preserve current session
    };
    const handleClearAllSessions = async () => {
        await clearSessions(false); // Clear ALL sessions including current
    };
    return (_jsxs("div", { className: "w-[300px] chat-glass-card chat-neon-border h-[500px] flex flex-col", onClick: handleClick, "data-testid": "chat-sidebar", children: [_jsx(SessionHeader, { sessionCount: sessions.length }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(ErrorBoundary, { fallback: _jsxs("div", { className: "p-4 text-center", children: [_jsx("p", { className: "text-sm text-destructive", children: "Failed to load sessions" }), _jsx("button", { className: "mt-2 px-3 py-1 text-xs bg-primary/80 text-primary-foreground rounded", onClick: () => window.location.reload(), children: "Retry" })] }), children: _jsx(Suspense, { fallback: _jsxs("div", { className: "p-4", children: [_jsx(Skeleton, { className: "h-6 w-24 mb-4" }), _jsx(SessionSkeleton, { count: 4 })] }), children: isLoading || ui.sessionLoading ? (_jsx(SessionSkeleton, { count: 4 })) : (_jsx(SessionList, { sessions: formattedSessions, onSelectSession: switchSession })) }) }) }), _jsx(SessionControls, { onNewSession: handleCreateSession, onClearSessions: handleClearOtherSessions, onCleanupSessions: cleanupInactiveSessions, onClearAllSessions: handleClearAllSessions, sessionCount: sessions.length, isLoading: isLoading || ui.sessionLoading }), _jsx(ModeSelectionDialog, { open: modeDialogOpen, onOpenChange: setModeDialogOpen, onCreateSession: handleCreateWithMode })] }));
};
