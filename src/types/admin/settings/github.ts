
export interface GitHubOAuthConnection {
  id: string;
  user_id: string;
  provider: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  account_username?: string;
  account_type?: string;
  scopes?: string[];
  created_at: string;
  updated_at: string;
  last_used?: string;
}

export interface GitHubConnectionStatus {
  user_id: string;
  status: string;
  last_check: string;
  error_message?: string;
  last_successful_operation?: string;
  metadata?: {
    username?: string;
    scopes?: string[];
    connected_at?: string;
    [key: string]: any;
  };
}

export type GitHubConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

export interface GitHubAuthError {
  code: string;
  message: string;
  trace_id?: string;
  details?: any;
}
