
import React from 'react';
import { Button } from '@/components/ui/button';
import { useChatUI } from '@/hooks/ui';
import { Minimize2, Maximize2, SidebarClose, SidebarOpen, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChatActionsProps {
  className?: string;
}

export const ChatActions: React.FC<ChatActionsProps> = ({ className = '' }) => {
  const { 
    isMinimized, 
    toggleMinimize, 
    toggleChat, 
    showSidebar, 
    toggleSidebar 
  } = useChatUI();

  const handleCloseChat = () => {
    toggleChat();
    toast.info('Chat closed');
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={toggleSidebar}
        title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
        aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
      >
        {showSidebar ? (
          <SidebarClose className="h-4 w-4" />
        ) : (
          <SidebarOpen className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={toggleMinimize}
        title={isMinimized ? 'Maximize' : 'Minimize'}
        aria-label={isMinimized ? 'Maximize' : 'Minimize'}
      >
        {isMinimized ? (
          <Maximize2 className="h-4 w-4" />
        ) : (
          <Minimize2 className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:text-destructive"
        onClick={handleCloseChat}
        title="Close chat"
        aria-label="Close chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
