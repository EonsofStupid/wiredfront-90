
import React from 'react';
import { X, Minimize2, Sidebar, Settings } from 'lucide-react';
import { useChatLayoutStore } from '@/stores/chat/chatLayoutStore';
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
  const { toggleMinimize, toggleOpen, toggleSidebar } = useChatLayoutStore();
  const { currentMode } = useChatModeStore();
  
  // Convert mode to display title
  const getDisplayTitle = () => {
    switch (currentMode) {
      case 'dev': return 'Developer Assistant';
      case 'image': return 'Image Generator';
      case 'training': return 'Training Mode';
      case 'code': return 'Code Assistant';
      case 'planning': return 'Project Planning';
      default: return 'AI Assistant';
    }
  };

  return (
    <div className={cn("chat-header", className)}>
      <button 
        className="chat-header-button hover:text-primary"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Sidebar size={18} />
      </button>
      
      <div className="chat-header-title">
        {getDisplayTitle()}
      </div>
      
      <div className="chat-header-actions">
        <button 
          className="chat-header-button hover:text-primary"
          onClick={toggleMinimize}
          aria-label="Minimize chat"
        >
          <Minimize2 size={18} />
        </button>
        
        <button 
          className="chat-header-button hover:text-primary"
          onClick={toggleOpen}
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
