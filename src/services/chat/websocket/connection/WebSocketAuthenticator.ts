import { supabase } from "@/integrations/supabase/client";
import { logger } from '../../LoggingService';

export class WebSocketAuthenticator {
  constructor(private sessionId: string) {}

  async validateSession(): Promise<{ isValid: boolean; token: string | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.error('Session validation failed', {
          error,
          sessionId: this.sessionId,
          context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
        });
        return { isValid: false, token: null };
      }

      const isValid = !!session?.access_token;
      logger.info('Session validation result', {
        isValid,
        sessionId: this.sessionId,
        context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
      });

      return { isValid, token: session?.access_token || null };
    } catch (error) {
      logger.error('Unexpected error during session validation', {
        error,
        sessionId: this.sessionId,
        context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
      });
      return { isValid: false, token: null };
    }
  }
}