import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VectorStatsService } from "@/services/rag/VectorStatsService";
import { VectorManagementService } from "@/services/rag/VectorManagementService";
import { VectorMigrationService } from "@/services/rag/VectorMigrationService";
import { RAGIndexingService } from "@/services/rag/RAGIndexingService";
import { RAGTierService } from "@/services/rag/RAGTierService";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
/**
 * Hook for managing project vector operations
 */
export function useProjectVectors(projectId) {
    const queryClient = useQueryClient();
    // Get project vector stats if projectId is provided
    const { data: vectorStats, isLoading: isLoadingVectorStats, error: vectorStatsError, refetch: refetchVectorStats } = useQuery({
        queryKey: ['project-vector-stats', projectId],
        queryFn: () => projectId ? VectorStatsService.getProjectVectorStats(projectId) : Promise.resolve(null),
        enabled: !!projectId,
        refetchOnWindowFocus: false,
    });
    // Check if project should be migrated to premium
    const { data: shouldMigrate, isLoading: isCheckingMigration } = useQuery({
        queryKey: ['should-migrate-project', projectId],
        queryFn: () => projectId ? RAGTierService.shouldMigrateToPreium(projectId) : Promise.resolve(false),
        enabled: !!projectId,
        refetchOnWindowFocus: false,
    });
    // Get vector limit status
    const { data: vectorLimitStatus, isLoading: isCheckingVectorLimit } = useQuery({
        queryKey: ['vector-limit-status', projectId],
        queryFn: () => projectId ? VectorStatsService.isProjectAtVectorLimit(projectId) : Promise.resolve({
            atLimit: false,
            usagePercentage: 0,
            vectorCount: 0,
            maxVectors: 0
        }),
        enabled: !!projectId,
        refetchOnWindowFocus: false,
    });
    // Index project mutation
    const indexMutation = useMutation({
        mutationFn: (pid) => RAGIndexingService.indexProject(pid),
        onSuccess: () => {
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
                toast.success("Project indexing initiated");
            }
        },
        onError: (error) => {
            logger.error("Indexing error:", error);
            toast.error("Failed to index project");
        }
    });
    // Migrate vectors mutation (from Supabase to Pinecone)
    const migrateVectorsMutation = useMutation({
        mutationFn: (pid) => VectorMigrationService.migrateVectors(pid),
        onSuccess: () => {
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
                toast.success("Vector migration completed");
            }
        },
        onError: (error) => {
            logger.error("Vector migration error:", error);
            toast.error("Failed to migrate vectors");
        }
    });
    // Delete vectors mutation
    const deleteMutation = useMutation({
        mutationFn: (pid) => VectorManagementService.deleteProjectVectors(pid),
        onSuccess: () => {
            if (projectId) {
                queryClient.invalidateQueries({ queryKey: ['project-vector-stats', projectId] });
                toast.success("Project vectors deleted successfully");
            }
        },
        onError: (error) => {
            logger.error("Delete vectors error:", error);
            toast.error("Failed to delete project vectors");
        }
    });
    // Handle upgrade prompt for project
    const handleUpgradePrompt = () => {
        if (vectorLimitStatus?.usagePercentage > 85) {
            toast("Project approaching vector limit", {
                description: `Your project is using ${vectorLimitStatus.usagePercentage.toFixed(1)}% of available vector storage. Consider upgrading to Premium.`,
                action: {
                    label: "Upgrade",
                    onClick: () => projectId && RAGIndexingService.migrateProjectToPremium(projectId)
                }
            });
        }
    };
    return {
        // Vector stats
        vectorStats,
        isLoadingVectorStats,
        vectorStatsError,
        refetchVectorStats,
        // Migration status
        shouldMigrate,
        isCheckingMigration,
        // Vector limits
        vectorLimitStatus,
        isCheckingVectorLimit,
        handleUpgradePrompt,
        // Operations
        indexProject: indexMutation.mutate,
        isIndexing: indexMutation.isPending,
        migrateVectors: migrateVectorsMutation.mutate,
        isMigrating: migrateVectorsMutation.isPending,
        deleteVectors: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
