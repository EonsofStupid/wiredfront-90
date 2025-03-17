
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';

interface RouteChangeData {
  from: string;
  to: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

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
      await supabase.from('system_logs').insert([logData] as any);

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
      await supabase.from('system_logs').insert([logData] as any);

    } catch (error) {
      console.error('Error logging feature view:', error);
    }
  }
}
