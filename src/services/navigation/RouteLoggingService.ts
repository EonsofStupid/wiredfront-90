
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

/**
 * Service for logging navigation events to the system_logs table
 */
export class RouteLoggingService {
  /**
   * Log a route change event
   */
  static async logRouteChange(from: string, to: string, userId?: string | null): Promise<void> {
    try {
      // Get user ID if not provided
      if (!userId) {
        const { data } = await supabase.auth.getSession();
        userId = data.session?.user?.id;
      }

      // Log to system logs table
      await supabase.from('system_logs').insert({
        level: 'info',
        source: 'navigation',
        message: `Route changed from ${from} to ${to}`,
        metadata: {
          previousRoute: from,
          currentRoute: to,
          timestamp: new Date().toISOString()
        },
        user_id: userId
      });

      // Also log to console for development
      logger.info(`Navigation: ${from} → ${to}`, { 
        source: 'navigation',
        metadata: { previousRoute: from, currentRoute: to } 
      });
    } catch (error) {
      logger.error(`Failed to log route change: ${error}`, { 
        source: 'navigation', 
        metadata: { error, from, to } 
      });
    }
  }

  /**
   * Get recent navigation logs for the current user or all users (admin only)
   */
  static async getNavigationLogs(limit = 50, allUsers = false): Promise<any[]> {
    try {
      let query = supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'navigation')
        .order('timestamp', { ascending: false })
        .limit(limit);

      // If not requesting all users, filter to current user only
      if (!allUsers) {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id;
        
        if (userId) {
          query = query.eq('user_id', userId);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error(`Failed to fetch navigation logs: ${error}`, { 
        source: 'navigation', 
        metadata: { error } 
      });
      return [];
    }
  }
}
