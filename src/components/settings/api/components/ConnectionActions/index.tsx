import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { ConnectionActionProps } from "../types";

export const useConnectionActions = (): ConnectionActionProps => {
  const [isConnecting, setIsConnecting] = useState(false);
  const queryClient = useQueryClient();

  const handleConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'connect',
          status: 'pending'
        });

      const state = crypto.randomUUID();
      localStorage.setItem('github_oauth_state', state);

      const { data, error } = await supabase.functions.invoke('github-oauth-init', {
        body: { 
          redirect_url: window.location.origin + '/settings',
          state
        }
      });

      if (error) throw error;
      
      if (data?.authUrl) {
        const popup = window.open(
          data.authUrl,
          'GitHub Login',
          'width=600,height=700,left=200,top=100'
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          throw new Error('Popup blocked! Please allow popups for this site.');
        }

        const pollTimer = setInterval(() => {
          if (popup.closed) {
            clearInterval(pollTimer);
            setIsConnecting(false);
            queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate GitHub connection');
      
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'connect',
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'disconnect',
          status: 'pending',
          metadata: { connection_id: connectionId }
        });

      const { error } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) throw error;

      await supabase
        .from('oauth_connection_logs')
        .insert({
          event_type: 'disconnect',
          status: 'success',
          metadata: { connection_id: connectionId }
        });

      queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
      toast.success('GitHub connection removed successfully');
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove GitHub connection');
    }
  };

  const handleToggleDefault = async (connectionId: string, isDefault: boolean) => {
    try {
      if (isDefault) {
        await supabase
          .from('oauth_connections')
          .update({ is_default: false })
          .eq('provider', 'github');
      }
      
      const { error } = await supabase
        .from('oauth_connections')
        .update({ is_default: isDefault })
        .eq('id', connectionId);
      
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['oauth-connections'] });
      toast.success('Default GitHub connection updated');
    } catch (error) {
      console.error('Error updating default connection:', error);
      toast.error('Failed to update default connection');
    }
  };

  return {
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onToggleDefault: handleToggleDefault
  };
};