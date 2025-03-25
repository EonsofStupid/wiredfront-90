
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeSelectionDialog } from './ModeSelectionDialog';
import { useSessionManager } from '@/hooks/sessions';
import { ChatMode } from '@/components/chat/chatbridge/types';

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
        providerId
      }
    });
    setIsDialogOpen(false);
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
        onClose={() => setIsDialogOpen(false)}
        onOpenChange={setIsDialogOpen}
        onCreateSession={handleCreateWithMode}
      />
    </>
  );
}
