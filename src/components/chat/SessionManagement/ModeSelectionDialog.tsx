import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProviderCategory } from '@/types/providers';
import { ChatMode } from '@/components/chat/chatbridge/types';

export type { ChatMode };

interface ModeSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMode?: (mode: ChatMode, providerId?: string) => void;
  onCreateSession?: (mode: ChatMode, providerId: string) => Promise<void>;
  availableProviders?: ProviderCategory[];
  currentProvider?: ProviderCategory | null;
  onOpenChange?: (open: boolean) => void;
}

export function ModeSelectionDialog({
  open,
  onClose,
  onSelectMode,
  onCreateSession,
  availableProviders,
  currentProvider,
  onOpenChange
}: ModeSelectionDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderCategory | null>(currentProvider);
  const [selectedMode, setSelectedMode] = useState<ChatMode>('chat');

  const availableModes = selectedProvider?.supportedModes || ['chat'];

  const defaultProvider = availableProviders?.find(p => p.isDefault) || 
                         availableProviders?.[0];

  const handleSelectProvider = (provider: ProviderCategory) => {
    setSelectedProvider(provider);
  };

  const handleConfirm = () => {
    if (selectedProvider) {
      if (onSelectMode) {
        onSelectMode(selectedMode, selectedProvider.id);
      }
      if (onCreateSession) {
        onCreateSession(selectedMode, selectedProvider.id);
      }
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Select Chat Mode</DialogTitle>
        <DialogDescription>
          Choose a provider and mode for your new chat session
        </DialogDescription>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Provider</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableProviders?.map((provider) => (
                <Button
                  key={provider.id}
                  variant={selectedProvider?.id === provider.id ? "default" : "outline"}
                  onClick={() => handleSelectProvider(provider)}
                >
                  {provider.name}
                </Button>
              ))}
            </div>
          </div>
          
          {selectedProvider && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableModes.map((mode) => (
                  <Button
                    key={mode}
                    variant={selectedMode === mode ? "default" : "outline"}
                    onClick={() => setSelectedMode(mode as ChatMode)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Start Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
