
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatStore } from '../../store/chatStore';
import { ChatMode } from '../../types';

export type { ChatMode };

interface ModeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (mode: ChatMode, providerId: string) => void;
}

export function ModeSelectionDialog({ 
  open, 
  onOpenChange,
  onCreateSession
}: ModeSelectionDialogProps) {
  const { availableProviders, currentProvider } = useChatStore();
  const [selectedMode, setSelectedMode] = useState<ChatMode>('chat');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    currentProvider?.id || (availableProviders[0]?.id || '')
  );

  const handleCreate = () => {
    onCreateSession(selectedMode, selectedProviderId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Chat Mode</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant={selectedMode === 'chat' ? 'default' : 'outline'}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedMode('chat')}
          >
            <span className="text-lg">💬</span>
            <span>Chat</span>
          </Button>
          
          <Button
            variant={selectedMode === 'dev' ? 'default' : 'outline'}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedMode('dev')}
          >
            <span className="text-lg">👨‍💻</span>
            <span>Developer</span>
          </Button>
          
          <Button
            variant={selectedMode === 'image' ? 'default' : 'outline'}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedMode('image')}
          >
            <span className="text-lg">🖼️</span>
            <span>Image</span>
          </Button>
          
          <Button
            variant={selectedMode === 'training' ? 'default' : 'outline'}
            className="h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => setSelectedMode('training')}
          >
            <span className="text-lg">📚</span>
            <span>Training</span>
          </Button>
        </div>
        
        {availableProviders.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Provider</label>
            <select
              className="w-full p-2 rounded border bg-background"
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
            >
              {availableProviders.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
