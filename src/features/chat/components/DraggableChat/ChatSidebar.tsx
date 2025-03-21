
import React from 'react';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';
import { formatDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { CHAT_MODE_DISPLAY_NAMES } from '@/types/chat/modes';

interface ChatSidebarProps {
  className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  const { 
    sessions, 
    currentSession, 
    setCurrentSession, 
    createSession,
    deleteSession
  } = useChatSessionStore();
  
  const handleCreateSession = async () => {
    try {
      const newSession = await createSession();
      if (newSession) {
        setCurrentSession(newSession);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };
  
  const handleDeleteSession = async (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };
  
  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.created_at || session.last_accessed || new Date());
    const dateStr = formatDate(date);
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    
    acc[dateStr].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);
  
  // Sort dates in descending order
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <div className={cn("chat-sidebar h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Chats</h2>
        <button
          type="button"
          onClick={handleCreateSession}
          className="p-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30 transition-colors"
          aria-label="New chat"
        >
          <Plus size={18} />
        </button>
      </div>
      
      {sortedDates.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <p>No chat history yet.</p>
          <p className="mt-2 text-sm">Start a new conversation.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-xs uppercase text-white/60 mb-2">{date}</h3>
              <div className="space-y-1">
                {sessionsByDate[date].map(session => (
                  <div
                    key={session.id}
                    onClick={() => setCurrentSession(session)}
                    className={cn(
                      "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-white/5",
                      currentSession?.id === session.id && "bg-white/10"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageSquare size={16} className="flex-shrink-0" />
                      <div className="truncate">
                        <div className="truncate text-sm">{session.title}</div>
                        <div className="text-xs text-white/60">
                          {CHAT_MODE_DISPLAY_NAMES[session.mode as any] || 'Chat'} • 
                          {session.message_count || 0} messages
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-full"
                      aria-label="Delete chat"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
