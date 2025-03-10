
export interface GitHubOAuthConnection {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id?: string;
  account_username?: string;
  account_type?: string;
  scopes?: string[];
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  last_used?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GitHubUserData {
  id: number;
  login: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  type?: string;
}

export interface GitHubAPIMetrics {
  rateLimit: {
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  };
  lastUpdated: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  html_url: string;
  updated_at: string;
  language?: string;
  default_branch: string;
}

export interface GitHubSettings {
  defaultToken?: string;
  autoSync: boolean;
  syncInterval: number;
  preferredAccountId?: string;
  lastSyncTimestamp?: string;
}
