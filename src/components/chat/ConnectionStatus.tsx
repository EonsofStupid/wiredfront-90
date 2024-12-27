import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useChatAPI } from "@/hooks/chat/useChatAPI";
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
    if (!isConfigured) {
      setStatus("disconnected");
      return;
    }

    switch (state) {
      case "connected":
        setStatus("connected");
        break;
      case "connecting":
      case "reconnecting":
        setStatus("connected"); // Show as connected while attempting to connect
        break;
      default:
        setStatus("disconnected");
    }
  }, [isConfigured, state]);

  const getStatusText = () => {
    if (!isConfigured) {
      return user ? "Configure API in Settings" : "Limited Mode";
    }
    return status === "connected" 
      ? user ? `Connected (${user.email})` : "Connected" 
      : "Disconnected";
  };

  return (
    <Badge 
      variant={status === "connected" ? "default" : "secondary"}
      className="whitespace-nowrap"
    >
      {getStatusText()}
    </Badge>
  );
};