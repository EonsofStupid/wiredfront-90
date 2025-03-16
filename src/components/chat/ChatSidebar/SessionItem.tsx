import React from 'react';
import { Message } from '@/types/chat';

interface SessionItemProps {
  session: {
    id: string;
    created_at: string;
    name?: string;
    // other session properties
  };
  messages: Message[];
  isActive: boolean;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  session,
  messages,
  isActive,
  onSelect,
  onDelete
}) => {
  // Extract the first message for display or use a placeholder
  const firstMessage = messages.length > 0 ? messages[0] : null;
  
  // Handle session selection
  const handleSelect = () => {
    onSelect(session.id);
  };
  
  // Handle session deletion with confirmation
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this session?')) {
      onDelete(session.id);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`session-item p-3 mb-2 rounded cursor-pointer ${isActive ? 'bg-primary/20' : 'bg-card hover:bg-primary/10'}`}
      onClick={handleSelect}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-sm">
          {session.name || `Session ${formatDate(session.created_at)}`}
        </h4>
        <button 
          className="delete-btn text-destructive/50 hover:text-destructive" 
          onClick={handleDelete}
          aria-label="Delete session"
        >
          ×
        </button>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {firstMessage ? firstMessage.content.substring(0, 30) + (firstMessage.content.length > 30 ? '...' : '') : 'Empty session'}
      </p>
      <div className="text-xs mt-1 text-muted-foreground">
        {formatDate(session.created_at)}
      </div>
    </div>
  );
};

export default SessionItem;
