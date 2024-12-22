import { supabase } from "@/integrations/supabase/client";
import { WebSocketLogger } from '../WebSocketLogger';

export class WebSocketAuthenticator {
  constructor(
    private logger: WebSocketLogger,
    private sessionId: string
  ) {}

  async validateSession(): Promise<string> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      const isValid = !!session?.access_token;
      this.logger.info('Token validation', {
        isValid,
        sessionId: this.sessionId,
        userId: session?.user?.id,
        timestamp: new Date().toISOString()
      });
      
      if (!isValid) {
        throw new Error('No valid session found');
      }
      
      return session.access_token;
    } catch (error) {
      this.logger.error('Authentication error', {
        sessionId: this.sessionId,
        error: error as Error,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
}