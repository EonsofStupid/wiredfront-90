
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserChatPreferences } from '@/types/chat-preferences';
import { toast } from 'sonner';

export function useUserChatPreferences() {
  const [preferences, setPreferences] = useState<UserChatPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('user_chat_preferences')
        .select('*')
        .eq('user_id', userData.user.id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        // Create default preferences if none exist
        const defaultPreferences: Partial<UserChatPreferences> = {
          user_id: userData.user.id,
          docked_icons: {},
          docked_sections: {},
          theme: 'light',
          metadata: {}
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('user_chat_preferences')
          .insert([defaultPreferences])
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        setPreferences(newData);
      } else {
        setPreferences(data);
      }
    } catch (err) {
      console.error('Error fetching chat preferences:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error('Failed to load chat preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<UserChatPreferences>) => {
    try {
      if (!preferences?.user_id) {
        throw new Error('No preferences found to update');
      }
      
      const { data, error } = await supabase
        .from('user_chat_preferences')
        .update(updates)
        .eq('user_id', preferences.user_id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      setPreferences(data);
      toast.success('Preferences updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating chat preferences:', err);
      toast.error('Failed to update preferences');
      throw err;
    }
  }, [preferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences
  };
}
