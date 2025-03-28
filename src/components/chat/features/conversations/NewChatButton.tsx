
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeSelectionDialog } from '../modes/components/ModeSelectionDialog';
import { ChatMode } from '@/components/chat/types/chat/enums';
import { useSessionManager } from '../../hooks/useSessionManager';

interface NewChatButtonProps {
  variant?: "default" | "outline" | "ghost";
  fullWidth?: boolean;
}

export function NewChatButton({ variant = "default", fullWidth = false }: NewChatButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createSession } = useSessionManager();
  
  const handleCreateWithMode = async (mode: ChatMode, providerId: string) => {
    await createSession({
      metadata: {
        mode,
        providerId
      }
    });
  };
  
  return (
    <>
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${fullWidth ? 'w-full justify-start' : ''}`}
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        <span>New Chat</span>
      </Button>
      
      <ModeSelectionDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateSession={handleCreateWithMode}
      />
    </>
  );
}
