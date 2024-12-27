import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useChatAPI } from "@/services/chat/hooks/useChatAPI";
import { ConnectionState } from "@/types/websocket";
import { useSessionStore } from "@/stores/session/store";

interface ConnectionStatusProps {
  state: ConnectionState;
}

export const ConnectionStatus = ({ state }: ConnectionStatusProps) => {
  const { isConfigured } = useChatAPI();
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      setStatus("disconnected");
      return;
    }

    if (!isConfigured) {
      setStatus("disconnected");
      return;
    }

    switch (state) {
      case "connected":
      case "connecting":
      case "reconnecting":
        setStatus("connected");
        break;
      default:
        setStatus("disconnected");
    }
  }, [isConfigured, state, user]);

  const getStatusText = () => {
    if (!user) {
      return "Limited Mode";
    }
    
    if (!isConfigured) {
      return "Configure API in Settings";
    }
    
    return status === "connected" 
      ? `Connected (${user.email})` 
      : "Disconnected";
  };

  const getStatusVariant = () => {
    if (!user) return "secondary";
    if (!isConfigured) return "outline";
    return status === "connected" ? "default" : "destructive";
  };

  return (
    <Badge 
      variant={getStatusVariant()}
      className="whitespace-nowrap"
    >
      {getStatusText()}
    </Badge>
  );
};