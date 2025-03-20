import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { toast } from "sonner";
export class RAGTierService {
    /**
     * Check if the current user can use premium RAG features
     */
    static async canUsePremiumRAG() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user)
                return false;
            const { data: userSettings, error } = await supabase
                .from('rag_user_settings')
                .select('tier')
                .eq('user_id', session.user.id)
                .single();
            if (error)
                throw error;
            return userSettings?.tier === 'premium';
        }
        catch (error) {
            logger.error("Error checking premium RAG status:", error);
            return false;
        }
    }
    /**
     * Upgrade the current user to premium RAG tier
     */
    static async upgradeToRagPremium() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                toast.error("You must be logged in to upgrade");
                return false;
            }
            // Check if Pinecone is configured
            const { data: pineconeConfig, error: configError } = await supabase
                .from('api_configurations')
                .select('*')
                .eq('api_type', 'pinecone')
                .eq('is_enabled', true)
                .maybeSingle();
            if (configError)
                throw configError;
            if (!pineconeConfig) {
                toast.error("Pinecone is not configured. Please set up Pinecone in API settings.");
                return false;
            }
            // Upgrade user to premium tier
            const { error } = await supabase
                .from('rag_user_settings')
                .update({
                tier: 'premium',
                max_vectors: 100000, // 100k vectors for premium
                max_queries: 1000, // 1000 queries per month
                vectorstore_type: 'pinecone'
            })
                .eq('user_id', session.user.id);
            if (error)
                throw error;
            // Initialize Pinecone vector store configuration if not already set up
            const { error: vectorStoreError } = await supabase
                .from('vector_store_configs')
                .insert({
                user_id: session.user.id,
                store_type: 'pinecone',
                is_active: true,
                endpoint_url: pineconeConfig.endpoint_url,
                environment: pineconeConfig.environment,
                index_name: pineconeConfig.index_name,
                config: {
                    dimensions: 1536, // OpenAI embedding dimensions
                    metric: 'cosine'
                }
            })
                .select()
                .single();
            // If the error is "duplicate key value" it means the config already exists, so we ignore it
            if (vectorStoreError && !vectorStoreError.message.includes('duplicate key value')) {
                throw vectorStoreError;
            }
            logger.info("User upgraded to premium RAG tier");
            return true;
        }
        catch (error) {
            logger.error("Error upgrading to premium RAG:", error);
            return false;
        }
    }
    /**
     * Check if a project should be migrated to premium tier
     * based on vector count and usage patterns
     */
    static async shouldMigrateToPreium(projectId) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user)
                return false;
            // Check if already on premium
            const isPremium = await this.canUsePremiumRAG();
            if (isPremium)
                return false;
            // Get current vector usage
            const { data: settings, error: settingsError } = await supabase
                .from('rag_user_settings')
                .select('vectors_used, max_vectors')
                .eq('user_id', session.user.id)
                .single();
            if (settingsError)
                throw settingsError;
            // If using more than 75% of vectors, suggest premium
            const usagePercentage = (settings.vectors_used / settings.max_vectors) * 100;
            return usagePercentage > 75;
        }
        catch (error) {
            logger.error("Error checking migration status:", error);
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
            const upgradeSuccess = await this.upgradeToRagPremium();
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
            logger.info(`Project ${projectId} successfully migrated to premium RAG tier`);
            toast.success("Project successfully migrated to premium tier");
            return true;
        }
        catch (error) {
            logger.error(`Error migrating project ${projectId} to premium tier:`, error);
            toast.error("Failed to migrate project to premium tier");
            return false;
        }
    }
}
