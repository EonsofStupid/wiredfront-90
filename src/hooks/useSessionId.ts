
import { useSessionManager } from './useSessionManager';

export const useSessionId = () => {
  const { currentSessionId } = useSessionManager();
  return currentSessionId;
};
