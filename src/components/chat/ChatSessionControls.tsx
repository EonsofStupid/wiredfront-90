import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface ChatSessionControlsProps {
  sessions: { id: string }[];
  currentSessionId: string;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onCloseSession?: (sessionId: string) => void;
}

export const ChatSessionControls = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
  onCloseSession,
}: ChatSessionControlsProps) => {
  const [sessionToClose, setSessionToClose] = useState<string | null>(null);
  const [confirmClose, setConfirmClose] = useState(false);

  const handleCloseSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToClose(sessionId);
  };

  const onConfirmClose = () => {
    if (sessionToClose && onCloseSession) {
      onCloseSession(sessionToClose);
    }
    setSessionToClose(null);
    setConfirmClose(false);
  };

  return (
    <>
      <div className="flex gap-2 justify-end px-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onNewSession}
          className="bg-dark-lighter/30 backdrop-blur-md border border-white/10 text-neon-blue hover:text-neon-pink hover:bg-dark-lighter/50 transition-all duration-300"
        >
          New Session
        </Button>
        {sessions.map((session) => (
          <div key={session.id} className="relative group">
            <Button
              variant={session.id === currentSessionId ? "default" : "outline"}
              size="sm"
              onClick={() => onSwitchSession(session.id)}
              className={`
                relative bg-dark-lighter/30 backdrop-blur-md border border-white/10
                ${session.id === currentSessionId 
                  ? 'text-neon-pink hover:text-neon-blue' 
                  : 'text-neon-blue hover:text-neon-pink'
                }
                hover:bg-dark-lighter/50 transition-all duration-300
              `}
            >
              {session.id.slice(0, 4)}
              {onCloseSession && (
                <X
                  className="absolute -top-2 -right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-125"
                  onClick={(e) => handleCloseSession(session.id, e)}
                />
              )}
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!sessionToClose} onOpenChange={() => setSessionToClose(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Close Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this chat session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="confirm"
              checked={confirmClose}
              onCheckedChange={(checked) => setConfirmClose(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I understand that I am closing this session
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-dark-lighter/30 hover:bg-dark-lighter/50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmClose}
              disabled={!confirmClose}
              className="bg-neon-pink/20 hover:bg-neon-pink/30 text-neon-pink disabled:opacity-50"
            >
              Close Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};