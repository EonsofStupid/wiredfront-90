import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { chatSessionsService } from '@/services/chat/chatSessionsService';
import { toast } from 'sonner';
export function ChatManager() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function loadSessions() {
            try {
                setLoading(true);
                const data = await chatSessionsService.fetchSessions();
                setSessions(data);
            }
            catch (err) {
                console.error('Error loading chat sessions:', err);
                setError(err instanceof Error ? err : new Error('Failed to load sessions'));
                toast.error('Failed to load chat sessions');
            }
            finally {
                setLoading(false);
            }
        }
        loadSessions();
    }, []);
    if (loading) {
        return _jsx("div", { className: "p-4", children: "Loading chat sessions..." });
    }
    if (error) {
        return (_jsxs("div", { className: "p-4 text-red-500", children: ["Error: ", error.message] }));
    }
    if (sessions.length === 0) {
        return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-medium mb-4", children: "No chat sessions yet" }), _jsx("p", { className: "text-muted-foreground", children: "Start a new chat to begin your conversation" }), _jsx("button", { className: "mt-4 px-4 py-2 bg-primary text-white rounded", onClick: async () => {
                        try {
                            await chatSessionsService.createSession({
                                title: 'New Chat',
                                mode: 'chat'
                            });
                            // Reload sessions after creating a new one
                            const refreshedSessions = await chatSessionsService.fetchSessions();
                            setSessions(refreshedSessions);
                            toast.success('New chat session created');
                        }
                        catch (err) {
                            console.error('Error creating session:', err);
                            toast.error('Failed to create new chat session');
                        }
                    }, children: "New Chat" })] }));
    }
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-medium mb-4", children: "Your Chat Sessions" }), _jsx("div", { className: "space-y-2", children: sessions.map(session => (_jsxs("div", { className: "p-3 border rounded hover:bg-accent cursor-pointer", children: [_jsx("h3", { className: "font-medium", children: session.title }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Mode: ", session.mode] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Created: ", new Date(session.created_at || '').toLocaleString()] })] }, session.id))) }), _jsx("button", { className: "mt-4 px-4 py-2 bg-primary text-white rounded", onClick: async () => {
                    try {
                        await chatSessionsService.createSession({
                            title: 'New Chat',
                            mode: 'chat'
                        });
                        // Reload sessions after creating a new one
                        const refreshedSessions = await chatSessionsService.fetchSessions();
                        setSessions(refreshedSessions);
                        toast.success('New chat session created');
                    }
                    catch (err) {
                        console.error('Error creating session:', err);
                        toast.error('Failed to create new chat session');
                    }
                }, children: "New Chat" })] }));
}
