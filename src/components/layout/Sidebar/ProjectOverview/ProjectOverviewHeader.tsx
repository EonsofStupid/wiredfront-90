
import { cn } from "@/lib/utils";

interface ProjectOverviewHeaderProps {
  className?: string;
}

export function ProjectOverviewHeader({ className }: ProjectOverviewHeaderProps) {
  return (
    <div className={cn("p-4 border-b border-neon-blue/20", className)}>
      <h2 className="text-neon-blue font-medium text-xl">Project Hub</h2>
    </div>
  );
}
