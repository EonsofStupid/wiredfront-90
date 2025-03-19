import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Code, Image, Bot } from "lucide-react";
import { useChatStore } from '../store/chatStore';
import { ChatMode } from '@/types/chat';

interface ModeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession: (mode: ChatMode, providerId: string) => Promise<void>;
}

export function ModeSelectionDialog({ 
  open, 
  onOpenChange, 
  onCreateSession 
}: ModeSelectionDialogProps) {
  const [selectedMode, setSelectedMode] = useState<ChatMode>('chat');
  const [isCreating, setIsCreating] = useState(false);
  const { availableProviders, currentProvider } = useChatStore();
  
  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
  };
  
  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const provider = currentProvider?.id || 
        availableProviders.find(p => p.category === selectedMode)?.id || 
        availableProviders[0]?.id;
      
      await onCreateSession(selectedMode, provider);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="chat-glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20">
        <DialogHeader>
          <DialogTitle>Create New Chat Session</DialogTitle>
          <DialogDescription>
            Select the type of chat session you want to create
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
          <Card 
            className={`cursor-pointer hover:bg-primary/5 transition-colors ${
              selectedMode === 'chat' ? 'border-primary' : 'border-[#2a273e]'
            }`}
            onClick={() => handleModeSelect('chat')}
          >
            <CardContent className="pt-6 text-center">
              <MessagesSquare className="h-12 w-12 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-medium">Chat</h3>
              <CardDescription>
                General conversation with AI
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer hover:bg-primary/5 transition-colors ${
              selectedMode === 'code' ? 'border-primary' : 'border-[#2a273e]'
            }`}
            onClick={() => handleModeSelect('code')}
          >
            <CardContent className="pt-6 text-center">
              <Code className="h-12 w-12 mx-auto mb-2 text-[#10b981]" />
              <h3 className="text-lg font-medium">Code</h3>
              <CardDescription>
                Programming assistance and code generation
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer hover:bg-primary/5 transition-colors ${
              selectedMode === 'image' ? 'border-primary' : 'border-[#2a273e]'
            }`}
            onClick={() => handleModeSelect('image')}
          >
            <CardContent className="pt-6 text-center">
              <Image className="h-12 w-12 mx-auto mb-2 text-[#f59e0b]" />
              <h3 className="text-lg font-medium">Image</h3>
              <CardDescription>
                Generate and modify images
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateSession} 
            disabled={isCreating}
            className="relative overflow-hidden"
          >
            {isCreating ? (
              <>
                <span className="opacity-0">Create</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <Bot className="h-4 w-4 animate-spin" />
                </span>
              </>
            ) : (
              'Create Session'
            )}
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
