
import { useChatSessionManager } from './sessions';

export const useSessionId = () => {
  const { currentSessionId } = useChatSessionManager();
  return currentSessionId;
};
