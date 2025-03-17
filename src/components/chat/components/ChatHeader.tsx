
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Minus, Sidebar, Maximize2, Settings, Wand2 } from 'lucide-react';
import { useChatStore } from '../store';
import { useChatMode } from '../providers/ChatModeProvider';
import { getChatModeDisplayName } from '@/utils/modeConversion';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onOpenModeSelector: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onToggleSidebar,
  onOpenModeSelector
}) => {
  const { 
    isMinimized, 
    toggleMinimize, 
    toggleChat,
    currentMode,
    currentProvider
  } = useChatStore();
  
  const { isEditorPage } = useChatMode();

  return (
    <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Sidebar className="h-4 w-4" />
        </Button>
        
        {!isMinimized && (
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-white">
              {getChatModeDisplayName(currentMode)}
            </h3>
            {currentProvider && (
              <div className="flex items-center">
                <span className="text-xs text-white/60">{currentProvider.name}</span>
                {isEditorPage && (
                  <Badge variant="outline" className="ml-2 h-4 text-[9px] border-green-500/30 text-green-400">
                    Editor
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        {!isMinimized && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onOpenModeSelector}
            aria-label="Change mode"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white/70 hover:text-red-500 hover:bg-white/10"
          onClick={toggleChat}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
