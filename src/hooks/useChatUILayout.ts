
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatUILayout } from '@/types/chat-preferences';
import { toast } from 'sonner';

export function useChatUILayout() {
  const [layout, setLayout] = useState<ChatUILayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLayout = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('chat_ui_layout')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (!data) {
        // Create default layout if none exists
        const defaultLayout = {
          user_id: userData.user.id,
          layout: {
            leftSidebar: ['contacts'],
            rightSidebar: ['emoji-picker'],
            bottomPanel: ['settings'],
            theme: 'light',
            fontSize: 'medium'
          }
        };
        
        const { data: newData, error: insertError } = await supabase
          .from('chat_ui_layout')
          .insert([defaultLayout])
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        setLayout(newData);
      } else {
        setLayout(data);
      }
    } catch (err) {
      console.error('Error fetching chat layout:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast.error('Failed to load chat layout');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLayout = useCallback(async (updates: Partial<ChatUILayout['layout']>) => {
    try {
      if (!layout?.id) {
        throw new Error('No layout found to update');
      }
      
      const updatedLayout = { 
        ...layout.layout, 
        ...updates 
      };
      
      const { data, error } = await supabase
        .from('chat_ui_layout')
        .update({ layout: updatedLayout })
        .eq('id', layout.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      setLayout(data);
      toast.success('Layout updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating chat layout:', err);
      toast.error('Failed to update layout');
      throw err;
    }
  }, [layout]);

  useEffect(() => {
    fetchLayout();
  }, [fetchLayout]);

  return {
    layout,
    loading,
    error,
    fetchLayout,
    updateLayout
  };
}
