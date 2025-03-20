/**
 * Stores the last visited path in session storage.
 * This is used to redirect users back to their intended destination after login.
 */
export const storeLastVisitedPath = (path: string) => {
  // Don't store login or auth-related paths
  if (path === '/login' || path.startsWith('/auth')) return;
  sessionStorage.setItem('lastVisitedPath', path);
};

/**
 * Retrieves the last visited path from session storage.
 * Returns the dashboard path if no previous path was stored.
 */
export const getLastVisitedPath = (): string => {
  return sessionStorage.getItem('lastVisitedPath') || '/dashboard';
};

/**
 * Removes the last visited path from session storage.
 */
export const clearLastVisitedPath = (): void => {
  sessionStorage.removeItem('lastVisitedPath');
};
