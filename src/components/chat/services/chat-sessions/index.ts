
export * from './mappers';
export * from './sessionCreate';
export * from './sessionUpdate';
export * from './sessionArchive';
export * from './sessionDelete';
export * from './sessionFetch';

// Helper functions for easier access
export const fetchUserSessions = async () => {
  return await import('./sessionFetch').then(module => module.fetchAllSessions());
};

export const switchToSession = async (sessionId: string) => {
  return await import('./sessionUpdate').then(module => module.switchToSession(sessionId));
};
