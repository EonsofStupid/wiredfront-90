
import React from 'react';
import { ChevronDown, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/components/chat/store/chatStore';
import { useChatSessionManager } from '@/components/chat/chat-structure/chatsidebar/hooks/chat-sessions';
import { cn } from '@/lib/utils';

export function ChatHeaderTopNav() {
  const { toggleMinimize, toggleChat, toggleSidebar, showSidebar } = useChatStore();
  const { currentSessionId, sessions } = useChatSessionManager();
  
  // Find current session
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const title = currentSession?.title || 'New Chat';

  return (
    <div className="flex items-center justify-between p-3 border-b border-border/30 bg-gradient-to-r from-background/90 to-background/70">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={toggleSidebar}
          aria-label={showSidebar ? "Hide chat history" : "Show chat history"}
        >
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200", 
              showSidebar ? "rotate-180" : ""
            )} 
          />
        </Button>
        <h3 className="text-sm font-medium truncate max-w-[200px]">{title}</h3>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={toggleMinimize}
          aria-label="Minimize chat"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-7 w-7"
          onClick={toggleChat}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
