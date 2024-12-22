import { supabase } from "@/integrations/supabase/client";
import { WebSocketLogger } from '../monitoring/WebSocketLogger';
import { toast } from 'sonner';

export class WebSocketAuthenticator {
  constructor(
    private logger: WebSocketLogger,
    private sessionId: string
  ) {}

  async validateSession(): Promise<string | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.access_token) {
        this.logger.error('Session validation failed', {
          error,
          sessionId: this.sessionId
        });
        toast.error('Authentication failed');
        return null;
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
      toast.error('Authentication error occurred');
      return null;
    }
  }
}