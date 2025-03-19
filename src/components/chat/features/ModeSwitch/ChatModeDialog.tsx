
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatMode, isChatMode } from '@/types/chat';
import { useChatMode } from '../../providers/ChatModeProvider';
import { ModeCard } from './ModeCard';
import { Code, Image, MessageSquare, GraduationCap, PlaneLanding } from 'lucide-react';
import { useChatStore } from '../../store';
import { validateChatMode } from '@/utils/validation/chatTypes';
import { toast } from 'sonner';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModeSelect: (mode: ChatMode, providerId: string) => void;
}

export function ChatModeDialog({ open, onOpenChange, onModeSelect }: ChatModeDialogProps) {
  const { currentMode, setMode } = useChatMode();
  const { availableProviders } = useChatStore();
  
  const handleModeSelect = (newMode: ChatMode, providerId: string) => {
    // Validate the mode
    const validMode = validateChatMode(newMode, { fallback: 'chat' });
    
    // Close the dialog
    onOpenChange(false);
    
    // Update the mode in the provider
    setMode(validMode);
    
    // Call the onModeSelect callback to update related state
    onModeSelect(validMode, providerId);
  };

  // Find the appropriate provider for a given mode
  const getProviderForMode = (mode: ChatMode): string => {
    if (mode === 'image') {
      return availableProviders.find(p => p.category === 'image')?.id || '';
    }
    return availableProviders.find(p => p.category === 'chat')?.id || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 border-purple-500/50 text-white backdrop-blur-md cyber-bg">
        <DialogHeader>
          <DialogTitle className="text-center text-neon-blue">Select Chat Mode</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <ModeCard 
            title="Chat"
            description="General assistance"
            icon={<MessageSquare className="h-8 w-8 text-neon-blue" />}
            isActive={currentMode === 'chat'}
            providerId={getProviderForMode('chat')}
            onSelect={() => handleModeSelect('chat', getProviderForMode('chat'))}
          />
          
          <ModeCard 
            title="Developer"
            description="Code assistance"
            icon={<Code className="h-8 w-8 text-neon-green" />}
            isActive={currentMode === 'dev'}
            providerId={getProviderForMode('dev')}
            onSelect={() => handleModeSelect('dev', getProviderForMode('dev'))}
          />
          
          <ModeCard 
            title="Image"
            description="Generate images"
            icon={<Image className="h-8 w-8 text-neon-pink" />}
            isActive={currentMode === 'image'}
            providerId={getProviderForMode('image')}
            onSelect={() => handleModeSelect('image', getProviderForMode('image'))}
          />
          
          <ModeCard 
            title="Training"
            description="Learn and practice"
            icon={<GraduationCap className="h-8 w-8 text-orange-400" />}
            isActive={currentMode === 'training'}
            providerId={getProviderForMode('training')}
            onSelect={() => handleModeSelect('training', getProviderForMode('training'))}
          />
          
          <ModeCard 
            title="Planning"
            description="Architecture planning"
            icon={<PlaneLanding className="h-8 w-8 text-cyan-400" />}
            isActive={currentMode === 'planning'}
            providerId={getProviderForMode('planning')}
            onSelect={() => handleModeSelect('planning', getProviderForMode('planning'))}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
