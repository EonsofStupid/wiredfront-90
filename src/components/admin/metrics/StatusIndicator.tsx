
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical';
  label: string;
  className?: string;
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  return (
    <Badge 
      variant="outline"
      className={cn(
        "px-2 py-1",
        status === 'healthy' && "border-green-500/50 text-green-500",
        status === 'warning' && "border-yellow-500/50 text-yellow-500",
        status === 'critical' && "border-red-500/50 text-red-500",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === 'healthy' && "bg-green-500",
          status === 'warning' && "bg-yellow-500",
          status === 'critical' && "bg-red-500"
        )} />
        <span>{label}</span>
      </div>
    </Badge>
  );
}
