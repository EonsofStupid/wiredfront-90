
import React from 'react';
import { Button } from "@/components/ui/button";
import { useChatMode } from "../providers/ChatModeProvider";
import { MessageSquareIcon, CodeIcon } from "lucide-react";
import { toast } from "sonner";

export function ModeSwitchModule() {
  const { mode, toggleMode, isEditorPage } = useChatMode();

  // Don't show the mode switch on editor page
  if (isEditorPage) {
    return null;
  }

  const handleToggleMode = () => {
    toggleMode();
    toast.success(`Switched to ${mode === 'default' ? 'Planning' : 'Code Generation'} mode`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleMode}
      className="flex items-center gap-2"
    >
      {mode === 'default' ? (
        <>
          <MessageSquareIcon className="h-4 w-4" />
          <span>Switch to Planning Mode</span>
        </>
      ) : (
        <>
          <CodeIcon className="h-4 w-4" />
          <span>Switch to Code Generation Mode</span>
        </>
      )}
    </Button>
  );
}
