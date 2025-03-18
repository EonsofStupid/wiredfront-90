
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { useChatMode } from '../../providers/ChatModeProvider';
import { ModeCard } from './ModeCard';
import { Code, Image, MessageSquare, GraduationCap } from 'lucide-react';
import { useChatStore } from '../../store';

interface ChatModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModeSelect: (mode: ChatMode, providerId: string) => void;
}

export function ChatModeDialog({ open, onOpenChange, onModeSelect }: ChatModeDialogProps) {
  const { mode, setMode } = useChatMode();
  const { availableProviders } = useChatStore();
  
  const handleModeSelect = (newMode: ChatMode, providerId: string) => {
    // Close the dialog
    onOpenChange(false);
    
    // Update the mode in the provider (with navigation)
    setMode(newMode, true);
    
    // Call the onModeSelect callback to update related state
    onModeSelect(newMode, providerId);
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
            isActive={mode === 'chat'}
            providerId={availableProviders.find(p => p.category === 'chat')?.id || ''}
            onSelect={() => handleModeSelect('chat', availableProviders.find(p => p.category === 'chat')?.id || '')}
          />
          
          <ModeCard 
            title="Developer"
            description="Code assistance"
            icon={<Code className="h-8 w-8 text-neon-green" />}
            isActive={mode === 'dev'}
            providerId={availableProviders.find(p => p.category === 'chat')?.id || ''}
            onSelect={() => handleModeSelect('dev', availableProviders.find(p => p.category === 'chat')?.id || '')}
          />
          
          <ModeCard 
            title="Image"
            description="Generate images"
            icon={<Image className="h-8 w-8 text-neon-pink" />}
            isActive={mode === 'image'}
            providerId={availableProviders.find(p => p.category === 'image')?.id || ''}
            onSelect={() => handleModeSelect('image', availableProviders.find(p => p.category === 'image')?.id || '')}
          />
          
          <ModeCard 
            title="Training"
            description="Learn and practice"
            icon={<GraduationCap className="h-8 w-8 text-orange-400" />}
            isActive={mode === 'training'}
            providerId={availableProviders.find(p => p.category === 'chat')?.id || ''}
            onSelect={() => handleModeSelect('training', availableProviders.find(p => p.category === 'chat')?.id || '')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
