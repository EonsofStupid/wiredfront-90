import { useMemo } from 'react';
import { InfiniteData } from '@tanstack/react-query';
import { Message } from '@/types/chat';

export const useCombinedMessages = (
  realtimeMessages: Message[], 
  queryData: InfiniteData<Message[]> | undefined
) => {
  return useMemo(() => {
    const queryMessages = queryData?.pages.flatMap(page => page) ?? [];
    return [...realtimeMessages, ...queryMessages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [realtimeMessages, queryData]);
};