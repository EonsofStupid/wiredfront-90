
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChatMode, ProviderCategory } from '@/components/chat/store/types/chat-store-types';
import { useChatStore } from '@/components/chat/store';
import { Badge } from '@/components/ui/badge';
import { Bot, Image, Code, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession?: (mode: ChatMode, providerId: string) => void;
}

export function ModeSelectionDialog({ open, onOpenChange, onCreateSession }: ModeSelectionDialogProps) {
  const { availableProviders, currentProvider } = useChatStore();
  const [selectedMode, setSelectedMode] = useState<ChatMode>('chat');
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    currentProvider?.id || (availableProviders[0]?.id || '')
  );

  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
  };

  const handleConfirm = () => {
    if (onCreateSession) {
      onCreateSession(selectedMode, selectedProviderId);
    }
    onOpenChange(false);
  };

  // Filter providers by category based on selected mode
  const getFilteredProviders = (): ProviderCategory[] => {
    const categoryMap: Record<ChatMode, string[]> = {
      'chat': ['chat', 'other'],
      'dev': ['chat', 'other'],
      'image': ['image'],
      'training': ['chat', 'other']
    };
    
    const categories = categoryMap[selectedMode] || ['chat'];
    return availableProviders.filter(p => categories.includes(p.category));
  };

  const filteredProviders = getFilteredProviders();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="chat-glass-card border-0 w-[90vw] max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Create New Chat
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="mode" className="mt-4">
          <TabsList className="grid grid-cols-2 bg-black/20">
            <TabsTrigger value="mode">Mode</TabsTrigger>
            <TabsTrigger value="provider">Provider</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mode" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <ModeButton 
                icon={<Bot className="h-5 w-5" />}
                label="Chat"
                description="General conversation"
                mode="chat"
                selectedMode={selectedMode}
                onSelect={handleModeSelect}
              />
              
              <ModeButton 
                icon={<Code className="h-5 w-5" />}
                label="Developer"
                description="Code assistance"
                mode="dev"
                selectedMode={selectedMode}
                onSelect={handleModeSelect}
              />
              
              <ModeButton 
                icon={<Image className="h-5 w-5" />}
                label="Image"
                description="Generate images"
                mode="image"
                selectedMode={selectedMode}
                onSelect={handleModeSelect}
              />
              
              <ModeButton 
                icon={<GraduationCap className="h-5 w-5" />}
                label="Training"
                description="Learning mode"
                mode="training"
                selectedMode={selectedMode}
                onSelect={handleModeSelect}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="provider" className="mt-4">
            <div className="space-y-1 mb-4">
              <h3 className="text-sm font-semibold text-white/80">
                Available for {selectedMode} mode
              </h3>
              <p className="text-xs text-white/60">
                Select a provider to use with this mode
              </p>
            </div>
            
            {filteredProviders.length === 0 ? (
              <div className="text-center p-6 bg-black/20 rounded-lg">
                <p className="text-white/60">No providers available for this mode</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2">
                {filteredProviders.map(provider => (
                  <ProviderButton
                    key={provider.id}
                    provider={provider}
                    isSelected={selectedProviderId === provider.id}
                    onSelect={handleProviderSelect}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleConfirm}
            className="bg-chat-neon-purple hover:bg-opacity-80"
            disabled={!selectedProviderId || filteredProviders.length === 0}
          >
            Create Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ModeButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  mode: ChatMode;
  selectedMode: string;
  onSelect: (mode: ChatMode) => void;
}

function ModeButton({ icon, label, description, mode, selectedMode, onSelect }: ModeButtonProps) {
  const isSelected = mode === selectedMode;
  
  return (
    <button
      className={`flex flex-col items-center text-center p-4 rounded-lg border transition-all ${
        isSelected 
          ? 'bg-chat-neon-purple/20 border-chat-neon-purple/50' 
          : 'bg-black/20 border-white/10 hover:bg-black/30'
      }`}
      onClick={() => onSelect(mode as ChatMode)}
    >
      <div className={`mb-2 ${isSelected ? 'text-chat-neon-purple' : 'text-white/70'}`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-white">{label}</h3>
      <p className="text-xs mt-1 text-white/60">{description}</p>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1">
          <CheckCircle2 className="h-4 w-4 text-chat-neon-purple fill-chat-neon-purple/30" />
        </div>
      )}
    </button>
  );
}

interface ProviderButtonProps {
  provider: ProviderCategory;
  isSelected: boolean;
  onSelect: (providerId: string) => void;
}

function ProviderButton({ provider, isSelected, onSelect }: ProviderButtonProps) {
  return (
    <button
      className={`flex items-start p-3 text-left rounded-lg border relative ${
        isSelected 
          ? 'bg-chat-neon-blue/20 border-chat-neon-blue/50' 
          : 'bg-black/20 border-white/10 hover:bg-black/30'
      }`}
      onClick={() => onSelect(provider.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-white truncate">{provider.name}</h3>
          {provider.isDefault && (
            <Badge className="ml-2 bg-chat-neon-blue/30 text-[9px]">Default</Badge>
          )}
        </div>
        <p className="text-xs mt-1 text-white/60 line-clamp-2">{provider.description}</p>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {provider.models.slice(0, 2).map((model, i) => (
            <Badge key={i} variant="outline" className="text-[9px] h-4 px-1 text-white/70 border-white/20">
              {model}
            </Badge>
          ))}
          {provider.models.length > 2 && (
            <Badge variant="outline" className="text-[9px] h-4 px-1 text-white/70 border-white/20">
              +{provider.models.length - 2} more
            </Badge>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-1 -right-1">
          <CheckCircle2 className="h-4 w-4 text-chat-neon-blue fill-chat-neon-blue/30" />
        </div>
      )}
    </button>
  );
}
