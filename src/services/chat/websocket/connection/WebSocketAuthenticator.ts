import { supabase } from "@/integrations/supabase/client";
import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { AuthenticationError } from '../types/errors';

export class WebSocketAuthenticator {
  private logger: WebSocketLogger;

  constructor(private sessionId: string) {
    this.logger = new WebSocketLogger(sessionId);
  }

  async validateSession(): Promise<string> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        this.logger.error('Session validation failed', {
          error,
          sessionId: this.sessionId
        });
        throw new AuthenticationError('No valid session found');
      }

      this.logger.info('Session validated', {
        sessionId: this.sessionId,
        userId: session.user.id
      });
      
      return session.access_token;
    } catch (error) {
      this.logger.error('Authentication error', {
        error,
        sessionId: this.sessionId
      });
      throw new AuthenticationError('Failed to validate session', {
        originalError: error
      });
    }
  }
}