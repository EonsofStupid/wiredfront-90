
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";

interface IndexingStatusSectionProps {
  isIndexing: boolean;
  recentlyImportedProject: {
    id: string;
    repoName: string;
  } | null;
}

export function IndexingStatusSection({ 
  isIndexing, 
  recentlyImportedProject 
}: IndexingStatusSectionProps) {
  if (!isIndexing || !recentlyImportedProject) {
    return null;
  }

  return (
    <div className="p-4">
      <ProjectIndexingStatus 
        projectId={recentlyImportedProject.id} 
        repoName={recentlyImportedProject.repoName}
      />
    </div>
  );
}
