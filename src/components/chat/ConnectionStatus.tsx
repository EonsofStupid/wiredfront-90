import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useChatAPI } from "@/hooks/chat/useChatAPI";
import { ConnectionState } from "@/types/websocket";

interface ConnectionStatusProps {
  state: ConnectionState;
}

export const ConnectionStatus = ({ state }: ConnectionStatusProps) => {
  const { isConfigured } = useChatAPI();
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

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

  return (
    <Badge variant={status === "connected" ? "default" : "destructive"}>
      {status === "connected" ? "Connected" : "Disconnected"}
    </Badge>
  );
};