
// This is a new file, we'll create a minimal implementation to show how it should use the ProviderCategory type
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProviderCategory } from '@/types/providers';
import { ChatMode } from '@/components/chat/chatbridge/types';

interface ModeSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: ChatMode, providerId?: string) => void;
  availableProviders: ProviderCategory[];
  currentProvider: ProviderCategory | null;
}

export function ModeSelectionDialog({
  open,
  onClose,
  onSelectMode,
  availableProviders,
  currentProvider
}: ModeSelectionDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderCategory | null>(currentProvider);
  const [selectedMode, setSelectedMode] = useState<ChatMode>('chat');

  // Find available modes from the selected provider
  const availableModes = selectedProvider?.supportedModes || ['chat'];

  // Find a default provider if none is selected
  const defaultProvider = availableProviders.find(p => p.isDefault) || 
                         availableProviders[0];

  const handleSelectProvider = (provider: ProviderCategory) => {
    setSelectedProvider(provider);
  };

  const handleConfirm = () => {
    if (selectedProvider) {
      onSelectMode(selectedMode, selectedProvider.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Select Chat Mode</DialogTitle>
        <DialogDescription>
          Choose a provider and mode for your new chat session
        </DialogDescription>
        
        <div className="space-y-4 py-4">
          {/* Provider selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Provider</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableProviders.map((provider) => (
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
          
          {/* Mode selection */}
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
