import { RAGTierService } from "./RAGTierService";
import { RAGIndexingService } from "./RAGIndexingService";
import { RAGMetricsService } from "./RAGMetricsService";
/**
 * Main RAG service that acts as a facade for specialized RAG services
 * This service delegates to other services for specific functionality
 */
export class RAGService {
    /**
     * Determine if a user can use premium RAG features
     */
    static async canUsePremiumRAG() {
        return RAGTierService.canUsePremiumRAG();
    }
    /**
     * Index a project's content with the appropriate RAG service based on user tier
     */
    static async indexProject(projectId) {
        return RAGIndexingService.indexProject(projectId);
    }
    /**
     * Get a user's RAG metrics and limits
     */
    static async getUserRAGMetrics() {
        return RAGMetricsService.getUserRAGMetrics();
    }
    /**
     * Upgrade a user's RAG tier to premium
     */
    static async upgradeToRagPremium() {
        return RAGTierService.upgradeToRagPremium();
    }
    /**
     * Track RAG usage for a project
     */
    static async trackRAGUsage(operation, projectId, metrics) {
        return RAGMetricsService.trackRAGUsage(operation, projectId, metrics);
    }
    /**
     * Check if a project exceeds standard tier limits and should be migrated
     */
    static async shouldMigrateToPreium(projectId) {
        return RAGTierService.shouldMigrateToPreium(projectId);
    }
    /**
     * Migrate a project from standard to premium tier
     * This includes moving vectors from Supabase to Pinecone
     */
    static async migrateProjectToPremium(projectId) {
        return RAGIndexingService.migrateProjectToPremium(projectId);
    }
}
