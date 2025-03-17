
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { NavigationLog, safeDataTransform, isNavigationLog, isQueryError } from '@/utils/typeUtils';

interface RouteChangeData {
  from: string;
  to: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export { type NavigationLog };

export class RouteLoggingService {
  /**
   * Log a route change in the application
   */
  static async logRouteChange(from: string, to: string, metadata: Record<string, any> = {}) {
    try {
      const { data: userData } = await supabase.auth.getUser();
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

      // Insert into system logs
      const { error } = await supabase
        .from('system_logs')
        .insert([logData]);

      if (error) {
        throw error;
      }

      // Also log to console
      logger.info(`Navigation: ${from} → ${to}`, { from, to });
    } catch (error) {
      console.error('Error logging route change:', error);
    }
  }

  /**
   * Log a feature viewed event
   */
  static async logFeatureViewed(featureName: string, route: string) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return;

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

      // Log to system logs
      const { error } = await supabase
        .from('system_logs')
        .insert([logData]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error logging feature view:', error);
    }
  }

  /**
   * Get navigation logs for the dashboard
   * 
   * @param limit Maximum number of logs to return
   * @param includeAllUsers Whether to include logs from all users or just the current user
   * @returns Array of navigation logs
   */
  static async getNavigationLogs(limit: number = 50, includeAllUsers: boolean = false): Promise<NavigationLog[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return [];

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

      const result = await query;
      
      if (isQueryError(result)) {
        throw result.error;
      }

      // Safely transform the query results to our NavigationLog type
      return safeDataTransform<NavigationLog>(result.data, isNavigationLog);
    } catch (error) {
      logger.error('Error fetching navigation logs:', error);
      return [];
    }
  }
}
