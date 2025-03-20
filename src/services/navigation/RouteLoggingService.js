import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { safeDataTransform, isNavigationLog } from '@/utils/typeUtils';
export class RouteLoggingService {
    /**
     * Log a route change in the application
     */
    static async logRouteChange(from, to, metadata = {}) {
        try {
            // Get the current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) {
                logger.error("Error fetching user for route logging:", userError);
            }
            const userId = userData?.user?.id;
            // Create log data
            const logData = {
                level: 'info',
                source: 'navigation',
                message: `Route changed from ${from} to ${to}`,
                metadata: {
                    from,
                    to,
                    timestamp: new Date().toISOString(),
                    ...metadata
                },
                user_id: userId
            };
            // Insert into system logs with type assertion
            const { data, error } = await supabase
                .from('system_logs')
                .insert([logData]);
            if (error) {
                throw error;
            }
            // Also log to console
            logger.info(`Navigation: ${from} → ${to}`, { from, to });
            return true;
        }
        catch (error) {
            console.error('Error logging route change:', error);
            return false;
        }
    }
    /**
     * Log a feature viewed event
     */
    static async logFeatureViewed(featureName, route) {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) {
                logger.error("Error fetching user for feature view logging:", userError);
                return false;
            }
            const userId = userData?.user?.id;
            if (!userId)
                return false;
            // Log data
            const logData = {
                level: 'info',
                source: 'feature_access',
                message: `Feature ${featureName} viewed`,
                metadata: {
                    feature: featureName,
                    route,
                    timestamp: new Date().toISOString()
                },
                user_id: userId
            };
            // Log to system logs with type assertion
            const { data, error } = await supabase
                .from('system_logs')
                .insert([logData]);
            if (error) {
                throw error;
            }
            return true;
        }
        catch (error) {
            console.error('Error logging feature view:', error);
            return false;
        }
    }
    /**
     * Get navigation logs for the dashboard
     *
     * @param limit Maximum number of logs to return
     * @param includeAllUsers Whether to include logs from all users or just the current user
     * @returns Array of navigation logs
     */
    static async getNavigationLogs(limit = 50, includeAllUsers = false) {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) {
                logger.error("Error fetching user for navigation logs:", userError);
                return [];
            }
            const userId = userData?.user?.id;
            if (!userId && !includeAllUsers)
                return [];
            // Use type assertion for system_logs table
            let query = supabase
                .from('system_logs')
                .select('*')
                .eq('source', 'navigation')
                .order('timestamp', { ascending: false })
                .limit(limit);
            // If we only want the current user's logs, add that constraint
            if (!includeAllUsers) {
                query = query.eq('user_id', userId);
            }
            const { data, error } = await query;
            if (error) {
                throw error;
            }
            // Safely handle data access with proper null checks
            const responseData = data && Array.isArray(data) ? data : [];
            // Safely transform the query results to our NavigationLog type
            return safeDataTransform(responseData, isNavigationLog);
        }
        catch (error) {
            logger.error('Error fetching navigation logs:', error);
            return [];
        }
    }
}
