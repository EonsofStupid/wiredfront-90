
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, ImageIcon, MessageSquare, BarChart } from 'lucide-react';
import { useChatMode } from '@/components/chat/providers/ChatModeProvider';
import { useChatStore } from '@/components/chat/store/chatStore';
import { ChatMode } from '@/components/chat/providers/ChatModeProvider';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModeDialog({ open, onOpenChange }: ChatModeDialogProps) {
  const navigate = useNavigate();
  const { mode, setMode } = useChatMode();
  const { messages, providers, startTime } = useChatStore();
  
  // Calculate session metrics
  const messageCount = messages?.length || 0;
  const aiResponses = messages?.filter(m => m.role === 'assistant').length || 0;
  const userMessages = messages?.filter(m => m.role === 'user').length || 0;
  const sessionDuration = startTime ? Math.floor((Date.now() - startTime) / 1000 / 60) : 0; // in minutes
  const codeBlocks = messages?.filter(m => m.content?.toString().includes('```')).length || 0;
  const avgResponseTime = aiResponses > 0 ? Math.round(sessionDuration / aiResponses * 60) : 0; // in seconds
  
  const handleModeSwitch = (newMode: ChatMode) => {
    if (setMode) {
      setMode(newMode);
    }
    
    // Navigate based on selected mode
    switch (newMode) {
      case 'editor':
        navigate('/editor');
        break;
      case 'image':
        navigate('/gallery');
        break;
      case 'standard':
        // Stay on current page or navigate to chat
        if (window.location.pathname === '/editor' || window.location.pathname === '/gallery') {
          navigate('/');
        }
        break;
      default:
        break;
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 max-w-md"
        style={{ zIndex: 'var(--z-chat-dialogs)' }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Chat Mode & Stats</DialogTitle>
          <DialogDescription>
            Switch modes or view detailed session statistics
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="modes" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="modes">Mode Selection</TabsTrigger>
            <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modes" className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant={mode === 'standard' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  mode === 'standard' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => handleModeSwitch('standard')}
              >
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="text-xs">Chat</span>
              </Button>
              <Button
                type="button"
                variant={mode === 'editor' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  mode === 'editor' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => handleModeSwitch('editor')}
              >
                <Code className="h-5 w-5 mb-2" />
                <span className="text-xs">Dev</span>
              </Button>
              <Button
                type="button"
                variant={mode === 'image' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  mode === 'image' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => handleModeSwitch('image')}
              >
                <ImageIcon className="h-5 w-5 mb-2" />
                <span className="text-xs">Image</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Switching modes will navigate you to the appropriate page.
            </p>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="rounded-lg border border-white/10 p-3 bg-black/20">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-[#1EAEDB]" />
                Session Statistics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs space-y-1.5">
                  <p><span className="text-muted-foreground">Duration:</span> {sessionDuration} min</p>
                  <p><span className="text-muted-foreground">Messages:</span> {messageCount}</p>
                  <p><span className="text-muted-foreground">User inputs:</span> {userMessages}</p>
                  <p><span className="text-muted-foreground">AI responses:</span> {aiResponses}</p>
                </div>
                <div className="text-xs space-y-1.5">
                  <p><span className="text-muted-foreground">Code blocks:</span> {codeBlocks}</p>
                  <p><span className="text-muted-foreground">Avg. response time:</span> {avgResponseTime}s</p>
                  <p><span className="text-muted-foreground">Provider:</span> {providers.currentProvider}</p>
                  <p><span className="text-muted-foreground">Est. cost:</span> ${((sessionDuration / 60) * 0.002).toFixed(4)}</p>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground italic">
              Note: Cost estimates are approximate and based on average usage.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
