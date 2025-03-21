
export const getLoginRedirectUrl = (): string => {
  // Check if there's a redirect URL in the session storage
  const redirectUrl = sessionStorage.getItem('redirectUrl');
  
  if (redirectUrl) {
    // Clear the redirect URL so it's not used again
    sessionStorage.removeItem('redirectUrl');
    return redirectUrl;
  }
  
  // Default to dashboard if no redirect URL is found
  return '/dashboard';
};

export const setLoginRedirectUrl = (url: string): void => {
  sessionStorage.setItem('redirectUrl', url);
};
