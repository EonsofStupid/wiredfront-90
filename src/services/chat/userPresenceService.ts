
import { supabase } from '@/integrations/supabase/client';
import { ChatUserStatus } from '@/types/chat-preferences';
import { logger } from '@/services/chat/LoggingService';

export const userPresenceService = {
  /**
   * Update the user's status
   */
  async updateStatus(
    status: ChatUserStatus['status'], 
    sessionId?: string
  ): Promise<ChatUserStatus> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const updates: Partial<ChatUserStatus> = {
        status,
        last_active: new Date().toISOString(),
        session_id: sessionId
      };
      
      const { data, error } = await supabase
        .from('chat_user_status')
        .upsert({
          user_id: userData.user.id,
          ...updates
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw error;
    }
  },
  
  /**
   * Subscribe to user status changes
   */
  subscribeToUserStatus(
    userIds: string[],
    callback: (status: ChatUserStatus) => void
  ) {
    return supabase
      .channel('user-status')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'chat_user_status',
          filter: `user_id=in.(${userIds.join(',')})`
        },
        payload => {
          callback(payload.new as ChatUserStatus);
        }
      )
      .subscribe();
  },
  
  /**
   * Set up heartbeat to maintain "online" status
   */
  setupHeartbeat(intervalSeconds = 30) {
    const interval = setInterval(() => {
      this.updateStatus('online').catch(error => {
        logger.error('Error updating heartbeat:', error);
      });
    }, intervalSeconds * 1000);
    
    return () => clearInterval(interval);
  },
  
  /**
   * Mark user as offline when leaving
   */
  async setOffline(): Promise<void> {
    try {
      await this.updateStatus('offline');
    } catch (error) {
      logger.error('Error setting offline status:', error);
    }
  }
};

// Set up event listeners for page visibility changes
export const initializePresence = () => {
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      userPresenceService.updateStatus('online');
    } else {
      userPresenceService.updateStatus('away');
    }
  });
  
  // Handle page unload
  window.addEventListener('beforeunload', () => {
    userPresenceService.setOffline();
  });
  
  // Start heartbeat
  return userPresenceService.setupHeartbeat();
};
