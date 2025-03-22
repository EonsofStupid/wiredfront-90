
import React from "react";
import { LogItem } from "./LogItem";
import { Json } from "@/integrations/supabase/types";

interface LogsTableProps {
  logs: Array<{
    id: string;
    timestamp: string;
    level: string;
    source: string;
    message: string;
    metadata: Json | null;
    user_id: string | null;
  }>;
  expandedLogId: string | null;
  toggleExpandLog: (id: string) => void;
}

export function LogsTable({ logs, expandedLogId, toggleExpandLog }: LogsTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Level</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Source</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <LogItem 
                key={log.id} 
                log={log}
                isExpanded={expandedLogId === log.id}
                onToggleExpand={() => toggleExpandLog(log.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
