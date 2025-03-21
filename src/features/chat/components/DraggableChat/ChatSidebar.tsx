
import React from 'react';
import { useChatSessionStore } from '@/stores/features/chat/sessionStore';
import { useLayoutActions } from '@/stores/chat/chatLayoutStore';
import { Clock, Plus } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

interface ChatSidebarProps {
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ className }) => {
  const { sessions, currentSession, setCurrentSession, createSession } = useChatSessionStore();
  const { toggleSidebar } = useLayoutActions();
  
  const handleNewChat = async () => {
    try {
      const newSession = await createSession();
      setCurrentSession(newSession);
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };
  
  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };
  
  return (
    <div className="chat-sidebar h-full p-2 flex flex-col">
      <div className="p-2 mb-4">
        <button 
          className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
          onClick={handleNewChat}
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2">
        {sessions.map(session => (
          <button
            key={session.id}
            className={`w-full text-left p-3 rounded-md flex flex-col transition-colors ${
              currentSession?.id === session.id 
                ? 'bg-neon-blue/30 cyber-border' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => handleSelectSession(session.id)}
          >
            <span className="font-medium truncate">{session.title}</span>
            <div className="flex items-center text-xs text-white/60 mt-1 gap-1">
              <Clock size={12} />
              <span>{formatRelativeTime(new Date(session.last_accessed))}</span>
            </div>
          </button>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <p>No recent chats</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
