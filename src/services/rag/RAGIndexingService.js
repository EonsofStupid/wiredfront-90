import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
import { RAGTierService } from "./RAGTierService";
export class RAGIndexingService {
    /**
     * Index a project's content with the appropriate RAG service based on user tier
     */
    static async indexProject(projectId) {
        try {
            const isPremium = await RAGTierService.canUsePremiumRAG();
            const vectorStoreType = isPremium ? 'pinecone' : 'supabase';
            logger.info(`Indexing project with ${vectorStoreType} store`, { projectId });
            // Notify the indexing service of the project to be indexed
            const { data, error } = await supabase.functions.invoke('index-project', {
                body: {
                    projectId,
                    vectorStoreType
                }
            });
            if (error)
                throw error;
            toast.success("Project indexing has started");
            return true;
        }
        catch (error) {
            logger.error("Project indexing error:", error);
            toast.error("Failed to index project");
            return false;
        }
    }
    /**
     * Migrate a project from standard to premium tier
     * This includes moving vectors from Supabase to Pinecone
     */
    static async migrateProjectToPremium(projectId) {
        try {
            // First upgrade the user to premium
            const upgradeSuccess = await RAGTierService.upgradeToRagPremium();
            if (!upgradeSuccess) {
                throw new Error("Failed to upgrade to premium tier");
            }
            // Then migrate the vectors
            const { data, error } = await supabase.functions.invoke('migrate-project-vectors', {
                body: {
                    projectId,
                    targetStore: 'pinecone'
                }
            });
            if (error)
                throw error;
            toast.success("Project successfully migrated to premium tier");
            return true;
        }
        catch (error) {
            logger.error("Error migrating project to premium:", error);
            toast.error("Failed to migrate project to premium tier");
            return false;
        }
    }
}
