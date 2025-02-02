export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  scopes: string[];
  authUrl: string;
}

export const oauthProviders: OAuthProvider[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    scopes: ['repo', 'user', 'workflow'],
    authUrl: 'https://github.com/login/oauth/authorize'
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  }
];