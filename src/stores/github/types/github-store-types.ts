
import { GithubSyncLog } from "@/types/github/sync";

/**
 * GitHub Connection Status
 */
export type GitHubConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "connecting"
  | "unknown";

/**
 * GitHub Connection Status Props
 */
export interface GitHubConnectionStatusProps {
  status: GitHubConnectionStatus;
  lastCheck: string | null;
  errorMessage: string | null;
  lastSuccessfulOperation: string | null;
  connectionId: string | null;
  metadata: {
    username?: string;
    scopes?: string[];
    [key: string]: any;
  } | null;
}

/**
 * GitHub Repository
 */
export interface GitHubRepository {
  id: string;
  connection_id: string;
  user_id: string;
  repo_name: string;
  repo_owner: string;
  repo_url: string;
  description?: string | null;
  default_branch: string;
  is_active: boolean;
  private?: boolean;
  auto_sync: boolean;
  last_synced_at: string | null;
  sync_status: string | null;
  created_at: string;
  updated_at: string;
  html_url?: string;
  language?: string | null;
  metadata?: any;
  webhook_id?: string | null;
  webhook_secret?: string | null;
  sync_frequency?: string;
}

/**
 * GitHub Linked Account
 */
export interface GitHubLinkedAccount {
  id: string;
  username: string;
  avatar_url?: string | null;
  default: boolean;
  status?: string;
  last_used?: string | null;
  token_expires_at?: string | null;
  scopes?: string[];
}

/**
 * GitHub Metric
 */
export interface GitHubMetric {
  id: string;
  metric_type: string;
  value: number;
  timestamp: string;
  metadata?: any;
}

/**
 * GitHub OAuth Log
 */
export interface GitHubOAuthLog {
  id: string;
  timestamp: string;
  user_id?: string;
  event_type: string;
  success: boolean;
  error_code?: string;
  error_message?: string;
  request_id?: string;
  metadata?: any;
}

/**
 * GitHub Store State
 *
 * Represents the state portion of the GitHub store
 */
export interface GithubState {
  // Connection state
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: GitHubConnectionStatusProps;
  githubUsername: string | null;
  linkedAccounts: GitHubLinkedAccount[];

  // Repository state
  repositories: GitHubRepository[];
  activeRepository: GitHubRepository | null;
  isRepositoriesLoading: boolean;
  repositoriesError: string | null;

  // Metrics state
  metrics: GitHubMetric[];
  isMetricsLoading: boolean;
  metricsError: string | null;

  // OAuth logs state
  oauthLogs: GitHubOAuthLog[];
  isOAuthLogsLoading: boolean;
  oauthLogsError: string | null;

  // Sync logs state
  logs: GithubSyncLog[];
  isLoading: boolean;
  error: string | null;
}

/**
 * GitHub Store Actions
 *
 * Defines all actions that can be performed on the GitHub store.
 */
export interface GithubActions {
  // Connection actions
  checkConnectionStatus: () => Promise<void>;
  connectGitHub: () => Promise<void>;
  disconnectGitHub: (accountId?: string) => Promise<void>;
  setDefaultGitHubAccount: (accountId: string) => Promise<void>;
  fetchLinkedAccounts: () => Promise<void>;

  // Repository actions
  fetchRepositories: () => Promise<void>;
  setActiveRepository: (repository: GitHubRepository | null) => void;
  
  // Metrics actions
  fetchMetrics: () => Promise<void>;
  
  // OAuth logs actions
  fetchOAuthLogs: () => Promise<void>;

  // Sync logs actions
  fetchLogs: (repositoryId: string) => Promise<void>;
  refetch: () => void;
  addLog: (log: Omit<GithubSyncLog, "id" | "created_at">) => Promise<void>;
}

/**
 * Combined GitHub Store Type
 *
 * Combines state and actions into a single store type.
 */
export type GithubStore = GithubState & GithubActions;
