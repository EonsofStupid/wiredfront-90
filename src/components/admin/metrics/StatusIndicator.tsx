
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatusIndicatorProps {
  status: 'healthy' | 'warning' | 'critical';
  label?: string;
  className?: string;
  compact?: boolean;
}

export function StatusIndicator({ status, label, className, compact = false }: StatusIndicatorProps) {
  if (compact) {
    return (
      <motion.div 
        className={cn(
          "h-2 w-2 rounded-full",
          status === 'healthy' && "bg-green-500",
          status === 'warning' && "bg-yellow-500",
          status === 'critical' && "bg-red-500"
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    );
  }

  return (
    <Badge 
      variant="outline"
      className={cn(
        "px-2 py-1 backdrop-blur-sm",
        status === 'healthy' && "border-green-500/50 text-green-500 bg-green-500/10",
        status === 'warning' && "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
        status === 'critical' && "border-red-500/50 text-red-500 bg-red-500/10",
        className
      )}
    >
      <div className="flex items-center space-x-2">
        <motion.div 
          className={cn(
            "h-2 w-2 rounded-full",
            status === 'healthy' && "bg-green-500",
            status === 'warning' && "bg-yellow-500",
            status === 'critical' && "bg-red-500"
          )}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span>{label || status}</span>
      </div>
    </Badge>
  );
}
