
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeSelectionDialog } from './ModeSelectionDialog';
import { useSessionManager } from '@/hooks/useSessionManager';

interface NewChatButtonProps {
  variant?: "default" | "outline" | "ghost";
  fullWidth?: boolean;
}

export function NewChatButton({ variant = "default", fullWidth = false }: NewChatButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sessions } = useSessionManager();
  
  // Calculate active sessions count
  const activeSessionsCount = sessions.filter(s => s.is_active).length;
  
  // For future implementation: max active sessions limit
  // const maxActiveSessions = 5; // This would come from admin settings
  // const isAtLimit = activeSessionsCount >= maxActiveSessions;
  
  return (
    <>
      <Button
        variant={variant}
        className={`flex items-center gap-2 ${fullWidth ? 'w-full justify-start' : ''}`}
        onClick={() => setIsDialogOpen(true)}
        // For future: disabled={isAtLimit}
      >
        <PlusCircle className="h-4 w-4" />
        <span>New Chat</span>
      </Button>
      
      <ModeSelectionDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      
      {/* For future implementation:
      {isAtLimit && (
        <p className="text-xs text-muted-foreground mt-1">
          Maximum active sessions reached ({maxActiveSessions}).
          Please archive or delete existing sessions.
        </p>
      )}
      */}
    </>
  );
}
