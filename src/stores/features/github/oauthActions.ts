import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GitHubState } from './types';

export interface OAuthActions {
  handleOAuthMessage: (event: MessageEvent) => Promise<void>;
  setupOAuthListener: () => () => void;
}

export const createOAuthActions = (set: (fn: (state: GitHubState) => Partial<GitHubState>) => void) => {
  const handleMessage = async (event: MessageEvent) => {
    // Validate the origin
    const isValidOrigin = event.origin === window.location.origin ||
                         event.origin.includes('github.com') ||
                         event.origin.includes('lovable.app');

    if (!isValidOrigin) {
      console.log('Ignoring message from unknown origin:', event.origin);
      return;
    }

    // Type guard for message data
    if (!event.data || typeof event.data !== 'object' || !('type' in event.data)) {
      console.log('Ignoring message with invalid format:', event.data);
      return;
    }

    const data = event.data;

    if (data.type === 'github-auth-success') {
      console.log('Received GitHub auth success message:', data);

      if (data.username) {
        console.log('Setting username from popup message:', data.username);
        set(state => ({
          currentUser: state.currentUser ? {
            ...state.currentUser,
            login: data.username
          } : null,
          error: null
        }));
        toast.success('GitHub connected successfully');
      } else {
        try {
          console.log('No username in success message, checking connection directly');
          set({ isLoading: true });

          const { data: statusData, error } = await supabase.functions.invoke('github-token-management', {
            body: { action: 'status' }
          });

          if (error) throw error;

          set(state => ({
            isConnected: statusData.isConnected,
            currentUser: statusData.user || null,
            linkedAccounts: statusData.linkedAccounts || [],
            error: null
          }));

          toast.success('GitHub connected successfully');
        } catch (error) {
          console.error('Error checking GitHub connection after success message:', error);
          set({
            error: error instanceof Error ? error.message : 'Connection verification failed',
            isConnected: false
          });
          toast.error('GitHub connection verification failed');
        } finally {
          set({ isLoading: false });
        }
      }
    } else if (data.type === 'github-auth-error') {
      console.error('Received GitHub auth error message:', data);
      set({
        error: data.error || 'Authentication failed',
        isConnected: false
      });
      toast.error(`GitHub authentication failed: ${data.error || 'Unknown error'}`);
    }
  };

  return {
    handleOAuthMessage: handleMessage,
    setupOAuthListener: () => {
      console.log('Setting up GitHub OAuth message listener');
      window.addEventListener('message', handleMessage);

      return () => {
        console.log('Removing GitHub OAuth message listener');
        window.removeEventListener('message', handleMessage);
      };
    }
  };
};
