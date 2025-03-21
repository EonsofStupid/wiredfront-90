import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChatModeStore } from '@/stores/features/chat/modeStore';
import { ChatMode } from "@/types/chat/modes";
import { Brain, Code, ImageIcon, MessageSquare, Zap } from "lucide-react";
import React from "react";

type ModeOption = {
  id: ChatMode;
  name: string;
  description: string;
  icon: React.ReactNode;
  providerId?: string;
};

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "chat",
    name: "Standard Chat",
    description: "General purpose chat assistant",
    icon: <MessageSquare className="h-6 w-6 text-neon-blue" />,
    providerId: "openai"
  },
  {
    id: "dev",
    name: "Developer Mode",
    description: "Specialized for coding assistance",
    icon: <Code className="h-6 w-6 text-neon-green" />,
    providerId: "openai"
  },
  {
    id: "image",
    name: "Image Generation",
    description: "Create images from text descriptions",
    icon: <ImageIcon className="h-6 w-6 text-neon-pink" />,
    providerId: "openai"
  },
  {
    id: "training",
    name: "Training Mode",
    description: "Learning and educational assistance",
    icon: <Brain className="h-6 w-6 text-purple-400" />,
    providerId: "openai"
  },
  {
    id: "planning",
    name: "Planning Mode",
    description: "Project planning and organization",
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    providerId: "openai"
  },
];

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
  const { setCurrentMode } = useChatModeStore();
  const [selectedMode, setSelectedMode] = React.useState<ModeOption | null>(null);

  const handleSelect = (mode: ModeOption) => {
    setSelectedMode(mode);
  };

  const handleCreate = () => {
    if (!selectedMode) return;

    // Update the global mode store
    setCurrentMode(selectedMode.id, selectedMode.providerId);

    // Call the onCreateSession callback with the selected mode
    onCreateSession(selectedMode.id, selectedMode.providerId || "openai");

    // Close the dialog
    onOpenChange(false);

    // Reset the selection for next time
    setSelectedMode(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="chat-glass-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="cyber-text-glow">Select Chat Mode</DialogTitle>
          <DialogDescription>
            Choose a specialized mode for your new chat session
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {MODE_OPTIONS.map(mode => (
            <div
              key={mode.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedMode?.id === mode.id
                  ? "cyber-border-active bg-neon-glow-subtle"
                  : "cyber-border hover:cyber-border-hover"
              }`}
              onClick={() => handleSelect(mode)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded cyber-bg-dark">{mode.icon}</div>
                <div>
                  <h3 className="font-medium">{mode.name}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedMode}
            className={!selectedMode ? "" : "bg-neon-glow"}
          >
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { type ChatMode };
