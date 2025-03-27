
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ className, size = "md", label }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-3 w-3 border-2",
    md: "h-4 w-4 border-2",
    lg: "h-6 w-6 border-3"
  };
  
  return (
    <div 
      className={cn(
        "animate-spin border-current border-t-transparent rounded-full", 
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={label || "Loading"}
    />
  );
}
