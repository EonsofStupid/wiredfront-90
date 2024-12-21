import { Message } from '@/types/chat';

export const useCombinedMessages = (
  realtimeMessages: Message[],
  queryData?: { pages: Message[][] }
) => {
  return [
    ...realtimeMessages,
    ...(queryData?.pages.flatMap(page => page) || [])
  ];
};