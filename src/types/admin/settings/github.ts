
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

// String literal type for simple connection states
export type GitHubConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

// Combined type that can be either the simple state or the detailed status object
export type GitHubConnectionStatusType = GitHubConnectionState | GitHubConnectionStatus;

export interface GitHubAuthError {
  code: string;
  message: string;
  trace_id?: string;
  details?: any;
}

// Standardized interface for components to use (camelCase properties)
export interface GitHubConnectionStatusProps {
  status: string;
  lastCheck: string | null;
  errorMessage: string | null;
  metadata: Record<string, any> | null;
}

// Helper function to normalize connection status for components
export const normalizeConnectionStatus = (status: GitHubConnectionStatusType): GitHubConnectionStatusProps => {
  if (typeof status === 'string') {
    return {
      status,
      lastCheck: null,
      errorMessage: null,
      metadata: null
    };
  }
  
  return {
    status: status.status,
    lastCheck: status.last_check,
    errorMessage: status.error_message || null,
    metadata: status.metadata || null
  };
};

// Helper to check if an object is a GitHubConnectionStatus
export const isConnectionStatusObject = (status: GitHubConnectionStatusType): status is GitHubConnectionStatus => {
  return typeof status === 'object' && 'user_id' in status;
};
