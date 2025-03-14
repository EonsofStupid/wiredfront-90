
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DatabaseIcon, InfoIcon } from "lucide-react";

interface ProjectIndexingStatusProps {
  projectId: string;
  repoName: string;
}

export function ProjectIndexingStatus({ projectId, repoName }: ProjectIndexingStatusProps) {
  const [indexingStatus, setIndexingStatus] = useState<{
    status: "pending" | "processing" | "completed" | "error";
    progress: number;
    files_processed: number;
    total_files: number;
  }>({
    status: "pending",
    progress: 0,
    files_processed: 0,
    total_files: 0
  });

  // In a real implementation, this would connect to a WebSocket or polling API
  // to get real-time updates on indexing progress
  useEffect(() => {
    const simulateIndexing = () => {
      // This is just a simulation - in reality, you'd connect to a WebSocket
      const interval = setInterval(() => {
        setIndexingStatus(prev => {
          if (prev.status === "completed" || prev.status === "error") {
            clearInterval(interval);
            return prev;
          }

          const newProgress = Math.min(prev.progress + 5, 100);
          const newFilesProcessed = Math.floor((newProgress / 100) * 20); // Assuming 20 files total
          
          if (newProgress === 100) {
            clearInterval(interval);
            return {
              status: "completed",
              progress: 100,
              files_processed: 20,
              total_files: 20
            };
          }

          return {
            status: prev.progress === 0 ? "pending" : "processing",
            progress: newProgress,
            files_processed: newFilesProcessed,
            total_files: 20
          };
        });
      }, 500);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(simulateIndexing, 1000);
    return () => clearTimeout(timer);
  }, [projectId]);

  if (indexingStatus.status === "completed") {
    return (
      <Alert className="border border-neon-blue/30 bg-neon-blue/10 text-neon-blue">
        <DatabaseIcon className="h-4 w-4" />
        <AlertTitle>Project Indexing Complete</AlertTitle>
        <AlertDescription className="text-gray-300">
          Your project has been successfully indexed for AI-assisted development.
          {indexingStatus.files_processed} files processed.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border border-neon-pink/30 bg-neon-pink/5">
      <InfoIcon className="h-4 w-4 text-neon-pink" />
      <AlertTitle className="text-neon-pink">
        {indexingStatus.status === "pending" ? "Preparing to Index" : "Indexing Project"}
      </AlertTitle>
      <AlertDescription className="space-y-2 text-gray-300">
        <p>
          {indexingStatus.status === "pending" 
            ? "Getting ready to analyze your repository..."
            : `Processing ${repoName} for AI-assisted development`}
        </p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>
              {indexingStatus.files_processed} of {indexingStatus.total_files} files
            </span>
            <span>{indexingStatus.progress}%</span>
          </div>
          <Progress value={indexingStatus.progress} className="h-2" 
            indicatorClassName="bg-gradient-to-r from-neon-blue to-neon-pink" />
        </div>
      </AlertDescription>
    </Alert>
  );
}
