
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { NavigationLog, isNavigationLog, safeArrayAccess } from '@/utils/typeUtils';
import { PostgrestResponse } from '@supabase/supabase-js';

/**
 * Service for logging and retrieving route navigation data
 */
export class RouteLoggingService {
  /**
   * Log a page navigation event
   */
  static async logNavigation(from: string, to: string, metadata: Record<string, any> = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const logData = {
        level: 'info',
        source: 'navigation',
        message: `Navigation from ${from} to ${to}`,
        metadata: {
          from,
          to,
          timestamp: new Date().toISOString(),
          ...metadata
        },
        user_id: user?.id || null
      };
      
      const { error } = await supabase
        .from('system_logs')
        .insert(logData);
      
      if (error) {
        console.error('Failed to log navigation:', error);
      }
    } catch (error) {
      console.error('Error in navigation logging:', error);
    }
  }
  
  /**
   * Get navigation logs for a user
   */
  static async getUserNavigationLogs(userId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'navigation')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return safeArrayAccess(data).filter(isNavigationLog);
    } catch (error) {
      console.error('Failed to fetch user navigation logs:', error);
      return [];
    }
  }
  
  /**
   * Get page view counts for analytics
   */
  static async getPageViewCounts(days = 7): Promise<Record<string, number>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'navigation')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      const pageViewMap: Record<string, number> = {};
      
      safeArrayAccess(data)
        .filter(isNavigationLog)
        .forEach(log => {
          const page = log.metadata.to;
          pageViewMap[page] = (pageViewMap[page] || 0) + 1;
        });
      
      return pageViewMap;
    } catch (error) {
      console.error('Failed to fetch page view counts:', error);
      return {};
    }
  }
  
  /**
   * Get navigation paths for a specific user
   * This returns the sequence of pages a user navigated through
   */
  static async getUserNavigationPath(userId: string, limit = 20): Promise<{from: string, to: string, timestamp: string}[]> {
    try {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'navigation')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return safeArrayAccess(data)
        .filter(isNavigationLog)
        .map(log => ({
          from: log.metadata.from,
          to: log.metadata.to,
          timestamp: log.metadata.timestamp
        }));
    } catch (error) {
      console.error('Failed to fetch user navigation path:', error);
      return [];
    }
  }
  
  /**
   * Get all navigation logs with optional filtering
   */
  static async getAllNavigationLogs(
    filters: { startDate?: Date; endDate?: Date; limit?: number } = {}
  ): Promise<NavigationLog[]> {
    try {
      const { startDate, endDate, limit = 100 } = filters;
      
      let query = supabase
        .from('system_logs')
        .select('*')
        .eq('source', 'navigation')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }
      
      const result = await query as PostgrestResponse<any>;
      
      if (result.error) throw result.error;
      
      // Safely handle data access with proper error handling
      return safeArrayAccess(result.data).filter(isNavigationLog);
    } catch (error) {
      logger.error('Failed to fetch navigation logs', { error });
      return [];
    }
  }
}
