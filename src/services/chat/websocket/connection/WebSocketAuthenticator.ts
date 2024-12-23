import { supabase } from "@/integrations/supabase/client";
import { logger } from '../../LoggingService';

export class WebSocketAuthenticator {
  private token: string | null = null;

  constructor(private sessionId: string) {}

  async validateSession(token: string): Promise<{ isValid: boolean }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      this.token = token;
      
      if (error || !user) {
        logger.error('Session validation failed', {
          error,
          sessionId: this.sessionId,
          context: { component: 'WebSocketAuthenticator', action: 'validateSession' }
        });
        return { isValid: false };
      }
      
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