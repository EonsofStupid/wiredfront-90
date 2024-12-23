import { Button } from "@/components/ui/button";

interface ChatSessionControlsProps {
  sessions: { id: string }[];
  currentSessionId: string;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
}

export const ChatSessionControls = ({
  sessions,
  currentSessionId,
  onNewSession,
  onSwitchSession,
}: ChatSessionControlsProps) => {
  return (
    <div className="flex gap-2 justify-end px-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onNewSession}
      >
        New Session
      </Button>
      {sessions.map((session) => (
        <Button
          key={session.id}
          variant={session.id === currentSessionId ? "default" : "outline"}
          size="sm"
          onClick={() => onSwitchSession(session.id)}
        >
          {session.id.slice(0, 4)}
        </Button>
      ))}
    </div>
  );
};