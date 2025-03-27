
import { cn } from "@/lib/utils";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";

interface IndexingStatusSectionProps {
  isIndexing: boolean;
  recentlyImportedProject: {
    id: string;
    repoName: string;
  } | null;
  className?: string;
}

export function IndexingStatusSection({ 
  isIndexing, 
  recentlyImportedProject,
  className
}: IndexingStatusSectionProps) {
  if (!isIndexing || !recentlyImportedProject) {
    return null;
  }

  return (
    <div className={cn(
      "p-4 border-b border-neon-blue/20",
      "bg-gradient-to-r from-dark-lighter/20 to-dark-lighter/5",
      className
    )}>
      <ProjectIndexingStatus 
        projectId={recentlyImportedProject.id} 
        repoName={recentlyImportedProject.repoName}
      />
    </div>
  );
}
