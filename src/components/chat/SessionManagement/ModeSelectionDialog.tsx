
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Code, Image } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSessionManager } from '@/hooks/useSessionManager';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';

interface ModeSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SessionMode = 'chat' | 'dev' | 'image';

interface ModeOption {
  id: SessionMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

export function ModeSelectionDialog({ isOpen, onClose }: ModeSelectionDialogProps) {
  const navigate = useNavigate();
  const { createSession } = useSessionManager();
  
  const modes: ModeOption[] = [
    {
      id: 'chat',
      label: 'Chat Mode',
      description: 'Standard assistant chat on this page',
      icon: <MessageSquare className="h-6 w-6" />,
      route: '/'
    },
    {
      id: 'dev',
      label: 'Developer Mode',
      description: 'Opens the coding editor interface',
      icon: <Code className="h-6 w-6" />,
      route: '/editor'
    },
    {
      id: 'image',
      label: 'Image Generation Mode',
      description: 'Opens the image gallery interface',
      icon: <Image className="h-6 w-6" />,
      route: '/gallery'
    }
  ];

  const handleModeSelect = async (mode: ModeOption) => {
    try {
      onClose();
      
      const sessionId = await createSession({
        title: `${mode.label} ${new Date().toLocaleString()}`,
        metadata: { mode: mode.id }
      });
      
      if (!sessionId) {
        toast.error(`Failed to create ${mode.label} session`);
        return;
      }
      
      logger.info(`Created new ${mode.id} session`, { sessionId });
      
      // If not chat mode or different route is needed, navigate there
      if (mode.id !== 'chat' || window.location.pathname !== '/') {
        navigate(`${mode.route}/${sessionId}`);
      }
    } catch (error) {
      logger.error('Failed to create session', { error, mode: mode.id });
      toast.error('Failed to create new session');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Chat Mode</DialogTitle>
          <DialogDescription>
            Choose the type of session you want to start
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              variant="outline"
              className="flex justify-start items-center gap-4 h-auto p-4"
              onClick={() => handleModeSelect(mode)}
            >
              <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                {mode.icon}
              </div>
              <div className="text-left">
                <h3 className="font-medium">{mode.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {mode.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
