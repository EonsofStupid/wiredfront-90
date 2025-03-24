import { GithubSyncLog } from "@/types/github/sync";

/**
 * GitHub Connection Status Type
 */
export type GitHubConnectionStatusType =
  | "active"
  | "inactive"
  | "error"
  | "expired";

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
 * GitHub Linked Account
 */
export interface GitHubLinkedAccount {
  id: string;
  username: string;
  avatar_url?: string;
  default: boolean;
  status: GitHubConnectionStatusType;
  last_used: string;
  token_expires_at?: string;
  scopes: string[];
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
  default_branch: string;
  is_active: boolean;
  auto_sync: boolean;
  webhook_secret?: string;
  webhook_id?: string;
  last_synced_at?: string;
  sync_status: "pending" | "success" | "error" | "queued" | "skipped";
  sync_frequency: "on_change" | "daily" | "weekly" | "monthly";
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  clone_from_repo_id?: string;
}

/**
 * GitHub Metric
 */
export interface GitHubMetric {
  id: string;
  repository_id: string;
  metric_type: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * GitHub OAuth Log
 */
export interface GitHubOAuthLog {
  id: string;
  user_id: string;
  action: "connect" | "disconnect" | "refresh";
  status: "success" | "failed";
  error_message?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

/**
 * GitHub Store State
 *
 * Represents the state portion of the GitHub store, including
 * connection status, sync logs, and loading states.
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
  updateConnectionStatus: (
    status: Partial<GitHubConnectionStatusProps>
  ) => Promise<void>;

  // Repository actions
  fetchRepositories: (connectionId: string) => Promise<void>;
  addRepository: (
    repository: Omit<GitHubRepository, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateRepository: (
    id: string,
    updates: Partial<GitHubRepository>
  ) => Promise<void>;
  deleteRepository: (id: string) => Promise<void>;
  setRepositoryActive: (id: string, isActive: boolean) => Promise<void>;
  setRepositoryAutoSync: (id: string, autoSync: boolean) => Promise<void>;
  updateRepositoryWebhook: (
    id: string,
    webhookSecret: string,
    webhookId: string
  ) => Promise<void>;
  setRepositorySyncFrequency: (
    id: string,
    frequency: GitHubRepository["sync_frequency"]
  ) => Promise<void>;
  setActiveRepository: (repository: GitHubRepository | null) => void;

  // Metrics actions
  fetchMetrics: (repositoryId: string, metricType?: string) => Promise<void>;
  addMetric: (metric: Omit<GitHubMetric, "id" | "timestamp">) => Promise<void>;
  getMetricHistory: (
    repositoryId: string,
    metricType: string,
    timeRange: string
  ) => Promise<GitHubMetric[]>;

  // OAuth logs actions
  fetchOAuthLogs: (userId?: string) => Promise<void>;
  addOAuthLog: (
    log: Omit<GitHubOAuthLog, "id" | "created_at">
  ) => Promise<void>;

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
