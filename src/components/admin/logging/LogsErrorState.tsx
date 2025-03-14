
import React from "react";
import { AlertCircle } from "lucide-react";

interface LogsErrorStateProps {
  error: string;
}

export function LogsErrorState({ error }: LogsErrorStateProps) {
  return (
    <div className="p-4 border border-red-300 bg-red-50/10 rounded-md flex items-start gap-3 text-red-500">
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" data-testid="logs-error-icon" />
      <div>
        <p className="font-medium mb-1">Error Loading Logs</p>
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );
}
