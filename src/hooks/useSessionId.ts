
import { useSessionManager } from '@/features/chat/hooks/useSessionManager';

export const useSessionId = () => {
  const { currentSessionId } = useSessionManager();
  return currentSessionId;
};
