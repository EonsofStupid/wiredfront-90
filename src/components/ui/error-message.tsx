
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 p-3 rounded-md",
      "bg-gradient-to-r from-neon-pink/20 to-red-500/20 text-white",
      "border border-neon-pink/30 backdrop-blur-sm",
      className
    )}>
      <AlertCircle className="h-5 w-5 text-neon-pink" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
