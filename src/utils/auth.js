export const getRedirectPath = (user) => {
    // Get stored path or default to dashboard
    const storedPath = sessionStorage.getItem('lastVisitedPath');
    if (!user)
        return '/login';
    // Check user role for custom landing page
    const userRole = user.app_metadata.role;
    if (userRole === 'admin')
        return '/admin/dashboard';
    // Return stored path or default dashboard
    return storedPath || '/dashboard';
};
export const storeLastVisitedPath = (path) => {
    // Don't store login or auth-related paths
    if (path === '/login' || path.startsWith('/auth'))
        return;
    sessionStorage.setItem('lastVisitedPath', path);
};
export const getLoginRedirectUrl = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/login') {
        const returnTo = new URLSearchParams(window.location.search).get('returnTo');
        return returnTo || '/dashboard';
    }
    return currentPath;
};
export const checkAuth = () => {
    // Add your auth check logic here
    return true;
};
export const getAuthToken = () => {
    // Add your token retrieval logic here
    return null;
};
export const setAuthToken = (token) => {
    // Add your token setting logic here
};
export const removeAuthToken = () => {
    // Add your token removal logic here
};
