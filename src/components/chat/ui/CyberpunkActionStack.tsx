
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trash2, 
  Download, 
  Share, 
  Copy, 
  Brain, 
  Code, 
  FileText, 
  Settings 
} from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useChatUIStore } from '@/stores/chat-ui';

const CyberpunkActionStack: React.FC = () => {
  const { resetChatState } = useChatStore();
  const { addDockItem, setActiveDockItem, toggleDockVisibility } = useChatUIStore();
  
  const handleShowMemory = () => {
    addDockItem('memory');
    setActiveDockItem('memory');
    toggleDockVisibility();
  };
  
  const handleShowFiles = () => {
    addDockItem('files');
    setActiveDockItem('files');
    toggleDockVisibility();
  };
  
  const handleShowCommands = () => {
    addDockItem('commands');
    setActiveDockItem('commands');
    toggleDockVisibility();
  };
  
  const handleShowSettings = () => {
    addDockItem('settings');
    setActiveDockItem('settings');
    toggleDockVisibility();
  };
  
  const handleClearChat = () => {
    if (confirm('Clear all messages? This cannot be undone.')) {
      resetChatState();
    }
  };

  return (
    <div className="chat-cyberpunk-action-stack">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
              onClick={handleShowMemory}
            >
              <Brain className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>AI Memory Browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
              onClick={handleShowFiles}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>File Explorer</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
              onClick={handleShowCommands}
            >
              <Code className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Code & Commands</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
              onClick={() => navigator.clipboard.writeText('Chat content')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Copy conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
            >
              <Share className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Share conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Save conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button"
              onClick={handleShowSettings}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="chat-cyberpunk-action-button text-destructive"
              onClick={handleClearChat}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Clear conversation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CyberpunkActionStack;
