
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, Bug, FileText, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { SystemLog } from "@/utils/typeUtils";

interface LogItemProps {
  log: SystemLog;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function LogItem({ log, isExpanded, onToggleExpand }: LogItemProps) {
  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" data-testid="log-level-icon" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" data-testid="log-level-icon" />;
      case 'warn': return <AlertCircle className="h-4 w-4 text-amber-500" data-testid="log-level-icon" />;
      case 'debug': return <Bug className="h-4 w-4 text-purple-500" data-testid="log-level-icon" />;
      default: return <Info className="h-4 w-4" data-testid="log-level-icon" />;
    }
  };
  
  const getSourceIcon = (source: string) => {
    if (source.includes('github')) return <GitBranch className="h-4 w-4" data-testid="log-source-icon" />;
    return <FileText className="h-4 w-4" data-testid="log-source-icon" />;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return timestamp;
    }
  };
  
  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'info': return 'default';
      case 'error': return 'destructive';
      case 'warn': return 'outline';
      case 'debug': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <tr 
      className={`hover:bg-muted/50 ${isExpanded ? 'bg-muted/30' : ''}`}
      onClick={onToggleExpand}
      data-testid="log-item-row"
    >
      <td className="px-4 py-2 text-xs whitespace-nowrap">
        {formatTimestamp(log.timestamp)}
      </td>
      <td className="px-4 py-2">
        <Badge variant={getLevelBadgeVariant(log.level)} className="flex gap-1 items-center">
          {getLogIcon(log.level)}
          <span className="capitalize text-xs">{log.level}</span>
        </Badge>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-1">
          {getSourceIcon(log.source)}
          <span className="text-xs">{log.source}</span>
        </div>
      </td>
      <td className="px-4 py-2 text-xs">
        <div className="max-w-md truncate">{log.message}</div>
        
        {isExpanded && log.metadata && (
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto" data-testid="log-metadata">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}
      </td>
    </tr>
  );
}
