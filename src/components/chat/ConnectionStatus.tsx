import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useChatAPI } from "@/hooks/chat/useChatAPI";

export const ConnectionStatus = () => {
  const { isConfigured } = useChatAPI();
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    setStatus(isConfigured ? "connected" : "disconnected");
  }, [isConfigured]);

  return (
    <Badge variant={status === "connected" ? "default" : "destructive"}>
      {status === "connected" ? "Connected" : "Disconnected"}
    </Badge>
  );
};