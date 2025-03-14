
import React from "react";
import { FileText } from "lucide-react";

interface LogsEmptyStateProps {
  logsExist: boolean;
}

export function LogsEmptyState({ logsExist }: LogsEmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-1">No logs found</h3>
      <p className="text-sm text-muted-foreground">
        {logsExist 
          ? "No logs match your current filters" 
          : "No system logs have been recorded yet"}
      </p>
    </div>
  );
}
