
import React from "react";
import { Loader2 } from "lucide-react";

export function LogsLoadingState() {
  return (
    <div className="py-8 flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" data-testid="logs-loading-spinner" />
      <p className="text-muted-foreground">Loading logs...</p>
    </div>
  );
}
