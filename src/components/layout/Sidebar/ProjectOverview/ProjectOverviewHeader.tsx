
import { cn } from "@/lib/utils";
import { BookIcon } from "lucide-react";

interface ProjectOverviewHeaderProps {
  className?: string;
}

export function ProjectOverviewHeader({ className }: ProjectOverviewHeaderProps) {
  return (
    <div className={cn(
      "p-4 border-b border-neon-blue/20",
      "bg-gradient-to-r from-neon-blue/10 to-transparent",
      className
    )}>
      <h2 className="text-neon-blue font-medium text-xl flex items-center gap-2">
        <BookIcon className="h-5 w-5" />
        Project Hub
      </h2>
    </div>
  );
}
