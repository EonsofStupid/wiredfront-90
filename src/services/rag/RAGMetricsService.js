import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
export class RAGMetricsService {
    /**
     * Get a user's RAG metrics and limits
     */
    static async getUserRAGMetrics() {
        try {
            // Get authenticated user
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                throw new Error("User not authenticated");
            }
            // Fetch user settings
            const { data: userSettings, error: settingsError } = await supabase
                .from('rag_user_settings')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
            if (settingsError)
                throw settingsError;
            // Fetch metrics
            const { data: metrics, error: metricsError } = await supabase
                .from('rag_metrics')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
            if (metricsError && metricsError.code !== 'PGRST116') {
                throw metricsError;
            }
            return {
                metrics: {
                    vectorCount: metrics?.vector_count || 0,
                    queryCount: metrics?.query_count || 0,
                    storageUsed: userSettings?.storage_used || 0,
                    averageLatency: metrics?.average_latency || 0
                },
                limits: {
                    maxVectors: userSettings?.max_vectors || 10000,
                    maxStorage: userSettings?.max_storage || 100 * 1024 * 1024, // Default 100MB
                    maxQueries: userSettings?.tier === 'premium' ? 1000 : 100 // Default query limits
                },
                tier: (userSettings?.tier || 'standard')
            };
        }
        catch (error) {
            logger.error("Error fetching RAG metrics:", error);
            // Return default values if there's an error
            return {
                metrics: { vectorCount: 0, queryCount: 0, storageUsed: 0, averageLatency: 0 },
                limits: { maxVectors: 10000, maxStorage: 100 * 1024 * 1024, maxQueries: 100 },
                tier: 'standard'
            };
        }
    }
    /**
     * Track RAG usage for a project
     */
    static async trackRAGUsage(operation, projectId, metrics) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user)
                return;
            await supabase.functions.invoke('track-rag-usage', {
                body: {
                    operation,
                    userId: session.user.id,
                    projectId,
                    ...metrics
                }
            });
        }
        catch (error) {
            logger.error("Error tracking RAG usage:", error);
        }
    }
}
