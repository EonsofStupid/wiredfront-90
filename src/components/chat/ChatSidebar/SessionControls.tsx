
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SessionControlsProps {
  onNewSession: () => void;
  onCleanupSessions: () => void;
}

export const SessionControls = ({ onNewSession, onCleanupSessions }: SessionControlsProps) => {
  return (
    <div className="flex gap-2 p-4 border-t">
      <Button
        variant="outline"
        className="flex-1"
        onClick={onNewSession}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Session
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCleanupSessions}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
