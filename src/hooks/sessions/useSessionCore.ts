
import { useQuery } from '@tanstack/react-query';
import { fetchUserSessions } from '@/services/sessions';

export const SESSION_QUERY_KEYS = {
  SESSIONS: ['sessions'],
  SESSION: (id: string) => ['sessions', id],
};

/**
 * Core hook for session data fetching
 */
export function useSessionCore() {
  const { 
    data: sessions, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: SESSION_QUERY_KEYS.SESSIONS,
    queryFn: fetchUserSessions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    sessions: sessions || [],
    isLoading,
    error,
    refreshSessions: refetch,
  };
}
