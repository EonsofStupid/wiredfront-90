
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChatProviderType } from '@/types/admin/settings/chat-provider';
import { useChatStore } from '../store/chatStore';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Code, ImageIcon, MessageSquare } from 'lucide-react';

export type ChatMode = 'standard' | 'editor' | 'image';

export interface ModeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (mode: ChatMode, provider: string) => Promise<void>;
}

export function ModeSelectionDialog({ 
  open, 
  onOpenChange,
  onCreateSession 
}: ModeSelectionDialogProps) {
  const navigate = useNavigate();
  const { providers } = useChatStore();
  const [selectedMode, setSelectedMode] = useState<ChatMode>('standard');
  const [selectedProvider, setSelectedProvider] = useState<string>(
    providers.availableProviders.find(p => p.isEnabled)?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableChatProviders = providers.availableProviders.filter(
    p => p.isEnabled && p.category === 'chat'
  );
  
  const availableImageProviders = providers.availableProviders.filter(
    p => p.isEnabled && p.category === 'image'
  );

  // Filter providers based on selected mode
  const filteredProviders = selectedMode === 'image' 
    ? availableImageProviders 
    : availableChatProviders;

  // Set default provider when mode changes
  React.useEffect(() => {
    if (filteredProviders.length > 0) {
      setSelectedProvider(filteredProviders[0].id);
    } else {
      setSelectedProvider('');
    }
  }, [selectedMode, filteredProviders]);

  const handleModeSelect = async () => {
    try {
      setIsSubmitting(true);
      
      await onCreateSession(selectedMode, selectedProvider);
      
      // Navigate based on selected mode
      switch (selectedMode) {
        case 'editor':
          navigate('/editor');
          break;
        case 'image':
          navigate('/gallery');
          break;
        default:
          // Stay on current page for standard chat mode
          break;
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">New Chat Session</DialogTitle>
          <DialogDescription>
            Select the chat mode and AI provider for your new conversation
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Mode</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={selectedMode === 'standard' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  selectedMode === 'standard' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => setSelectedMode('standard')}
              >
                <MessageSquare className="h-5 w-5 mb-2" />
                <span className="text-xs">Chat</span>
              </Button>
              <Button
                type="button"
                variant={selectedMode === 'editor' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  selectedMode === 'editor' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => setSelectedMode('editor')}
              >
                <Code className="h-5 w-5 mb-2" />
                <span className="text-xs">Editor</span>
              </Button>
              <Button
                type="button"
                variant={selectedMode === 'image' ? 'default' : 'outline'}
                className={`flex flex-col items-center justify-center p-4 h-auto ${
                  selectedMode === 'image' ? 'border-primary' : 'border-white/10'
                }`}
                onClick={() => setSelectedMode('image')}
              >
                <ImageIcon className="h-5 w-5 mb-2" />
                <span className="text-xs">Image</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Provider</h3>
            <Select 
              value={selectedProvider} 
              onValueChange={setSelectedProvider}
              disabled={filteredProviders.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an AI provider" />
              </SelectTrigger>
              <SelectContent>
                {filteredProviders.length > 0 ? (
                  filteredProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No available providers for this mode
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleModeSelect}
              disabled={isSubmitting || filteredProviders.length === 0}
            >
              {isSubmitting ? "Creating..." : "Create Chat"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
