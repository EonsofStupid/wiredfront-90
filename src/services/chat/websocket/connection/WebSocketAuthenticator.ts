import { supabase } from "@/integrations/supabase/client";
import { logger } from '../../LoggingService';

export class WebSocketAuthenticator {
  private token: string | null = null;

  constructor(private sessionId: string) {}

  async validateSession(token: string): Promise<{ isValid: boolean }> {
    try {
      // First check if we have a current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        logger.error('Session validation failed', {
          error: sessionError,
          sessionId: this.sessionId,
          context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
        });
        return { isValid: false };
      }

      if (!session) {
        logger.warn('No active session found', {
          sessionId: this.sessionId,
          context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
        });
        return { isValid: false };
      }

      // Store the valid token
      this.token = session.access_token;
      return { isValid: true };
      
    } catch (error) {
      logger.error('Session validation error', {
        error,
        sessionId: this.sessionId,
        context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
      });
      return { isValid: false };
    }
  }

  getToken(): string {
    return this.token || '';
  }
}