import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const useMessageQuery = (sessionId: string | null, isMinimized: boolean) => {
  return useInfiniteQuery<Message[], Error>({
    queryKey: ['messages', sessionId],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
      if (!sessionId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_session_id', sessionId)
        .order('created_at', { ascending: false })
        .range(pageParam * 20, (pageParam + 1) * 20 - 1);

      if (error) throw error;
      return data as Message[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length : undefined;
    },
    enabled: !isMinimized && !!sessionId,
  });
};