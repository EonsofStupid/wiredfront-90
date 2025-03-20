import { useRAGMetrics } from "./useRAGMetrics";
import { useRAGTier } from "./useRAGTier";
import { useProjectVectors } from "./useProjectVectors";
import { useVectorSearch } from "./useVectorSearch";
/**
 * Main hook for RAG operations, composing specialized hooks
 */
export function useRAGOperations(projectId) {
    const ragMetrics = useRAGMetrics();
    const ragTier = useRAGTier();
    const projectVectors = useProjectVectors(projectId);
    const vectorSearch = useVectorSearch(projectId);
    // When a project ID changes, check if upgrade prompt is needed
    if (projectId && projectVectors.vectorLimitStatus && !projectVectors.isCheckingVectorLimit) {
        projectVectors.handleUpgradePrompt();
    }
    return {
        // RAG metrics
        ...ragMetrics,
        // Tier operations
        ...ragTier,
        // Project vector operations
        ...projectVectors,
        // Search operations
        ...vectorSearch,
    };
}
