import { useMemo } from 'react';
import { InfiniteData } from '@tanstack/react-query';

export const useCombinedMessages = (realtimeMessages: any[], queryData: InfiniteData<any[]> | undefined) => {
  return useMemo(() => {
    const queryMessages = queryData?.pages.flatMap(page => page) ?? [];
    return [...realtimeMessages, ...queryMessages].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [realtimeMessages, queryData]);
};