import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConnectionButtonProps } from "./types";

export function ConnectionButton({ isConnecting, onConnect }: ConnectionButtonProps) {
  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className={cn(
        "flex items-center gap-2 transition-all",
        isConnecting && "animate-pulse"
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Github className="h-4 w-4" />
          Connect GitHub
        </>
      )}
    </Button>
  );
}