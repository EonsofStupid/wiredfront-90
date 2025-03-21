
import React from 'react';
import { Code, MessageSquare, Image, BookOpen, FileCode, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ChatMode, CHAT_MODE_DESCRIPTIONS, CHAT_MODE_DISPLAY_NAMES } from '@/types/chat/modes';
import { useChatModeStore } from '@/stores/features/chat/modeStore';

interface ModeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModeSelectionDialog({
  open,
  onOpenChange
}: ModeSelectionDialogProps) {
  const { setMode } = useChatModeStore();
  
  const handleSelectMode = (mode: ChatMode) => {
    setMode(mode);
    onOpenChange(false);
  };
  
  const getModeIcon = (mode: ChatMode) => {
    switch (mode) {
      case 'chat':
        return <MessageSquare className="h-6 w-6" />;
      case 'dev':
        return <Code className="h-6 w-6" />;
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'training':
        return <BookOpen className="h-6 w-6" />;
      case 'code':
        return <FileCode className="h-6 w-6" />;
      case 'planning':
        return <FileText className="h-6 w-6" />;
      default:
        return <MessageSquare className="h-6 w-6" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Select Chat Mode</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {(Object.keys(CHAT_MODE_DISPLAY_NAMES) as ChatMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => handleSelectMode(mode)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-800",
                "hover:bg-white/5 transition-colors hover:border-white/20"
              )}
            >
              <div className="p-3 rounded-full bg-white/10 mb-2">
                {getModeIcon(mode)}
              </div>
              <div className="text-center">
                <h3 className="font-medium">{CHAT_MODE_DISPLAY_NAMES[mode]}</h3>
                <p className="text-xs text-white/60 mt-1">
                  {CHAT_MODE_DESCRIPTIONS[mode]}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
