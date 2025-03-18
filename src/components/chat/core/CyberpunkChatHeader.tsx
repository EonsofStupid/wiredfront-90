
import React, { useState } from 'react';
import { X, Minimize2, Maximize2, Pin, PinOff, Layout, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../store/chatStore';
import { useChatUIStore } from '@/stores/chat-ui';
import { getChatModeDisplayName } from '@/utils/modeConversion';
import { ChatModeDialog } from '../features/ModeSwitch/ChatModeDialog';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { supabaseModeToStoreMode } from '@/utils/modeConversion';
import { toast } from 'sonner';

interface CyberpunkChatHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onToggleDock: () => void;
  onToggleDockPanel: () => void;
}

const CyberpunkChatHeader: React.FC<CyberpunkChatHeaderProps> = ({
  isMinimized,
  onToggleMinimize,
  onToggleDock,
  onToggleDockPanel
}) => {
  const { 
    toggleChat,
    currentMode,
    currentProvider,
    setCurrentMode,
    updateCurrentProvider,
    availableProviders
  } = useChatStore();
  
  const { isDocked, theme } = useChatUIStore();
  const [modeDialogOpen, setModeDialogOpen] = useState(false);

  // Handle selecting a mode from the dialog
  const handleModeSelect = (mode: SupabaseChatMode, providerId: string) => {
    // Convert from Supabase mode to store mode
    const storeMode = supabaseModeToStoreMode(mode);
    setCurrentMode(storeMode);
    
    // Find and update current provider
    const provider = availableProviders.find(p => p.id === providerId);
    if (provider) {
      updateCurrentProvider(provider);
      
      toast.success(`Switched to ${provider.name} in ${storeMode} mode`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
    
    setModeDialogOpen(false);
  };

  return (
    <div className="chat-cyberpunk-header">
      <div className="chat-cyberpunk-header-left">
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-header-button"
          onClick={onToggleDockPanel}
        >
          <Layout className="h-4 w-4" />
        </Button>
        
        {!isMinimized && (
          <div className="chat-cyberpunk-header-info">
            <h3 className="chat-cyberpunk-header-title">
              {getChatModeDisplayName(currentMode)}
            </h3>
            {currentProvider && (
              <div className="chat-cyberpunk-header-provider">
                <span className="chat-cyberpunk-provider-name">{currentProvider.name}</span>
                <Badge variant="outline" className="chat-cyberpunk-mode-badge">
                  {currentMode}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="chat-cyberpunk-header-controls">
        {!isMinimized && (
          <Button
            variant="ghost"
            size="icon"
            className="chat-cyberpunk-header-button"
            onClick={() => setModeDialogOpen(true)}
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-header-button"
          onClick={onToggleDock}
          aria-label={isDocked ? "Undock" : "Dock"}
        >
          {isDocked ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-header-button"
          onClick={onToggleMinimize}
          aria-label={isMinimized ? "Maximize" : "Minimize"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="chat-cyberpunk-header-button chat-cyberpunk-close-button"
          onClick={toggleChat}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ChatModeDialog
        open={modeDialogOpen}
        onOpenChange={setModeDialogOpen}
        onModeSelect={handleModeSelect}
      />
    </div>
  );
};

export default CyberpunkChatHeader;
