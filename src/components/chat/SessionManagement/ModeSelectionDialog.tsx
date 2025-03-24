
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChatMode } from '@/integrations/supabase/types/enums';
import { Code, MessageSquare, Image, BrainCircuit } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentProvider } = useChatStore();
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onCreateSession(
        selectedMode, 
        currentProvider?.id || 'default'
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modeOptions: Array<{
    value: ChatMode;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      value: 'chat',
      label: 'Chat Assistant',
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      description: 'General conversation and information assistance'
    },
    {
      value: 'code',
      label: 'Code Assistant',
      icon: <Code className="h-5 w-5 text-green-500" />,
      description: 'Help with coding, debugging, and development'
    },
    {
      value: 'image',
      label: 'Image Generator',
      icon: <Image className="h-5 w-5 text-purple-500" />,
      description: 'Create and edit images based on your descriptions'
    },
    {
      value: 'training',
      label: 'Training Assistant',
      icon: <BrainCircuit className="h-5 w-5 text-yellow-500" />,
      description: 'Guided learning and educational content'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Choose Session Mode</DialogTitle>
          <DialogDescription>
            Select the type of assistant you need for this session
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={selectedMode} 
            onValueChange={(value) => setSelectedMode(value as ChatMode)}
            className="space-y-3"
          >
            {modeOptions.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <div className="flex flex-1 items-start space-x-3">
                  <div className="flex-shrink-0 bg-background/30 p-2 rounded-full">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="text-base font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/10 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
