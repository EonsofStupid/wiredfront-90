
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
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  language: string | null;
  default_branch: string;
  last_synced_at: string | null;
  sync_status: string | null;
  created_at: string;
  updated_at: string;
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
  linkedAccounts: Array<{
    id: string;
    username: string;
    default: boolean;
  }>;

  // Repository state
  repositories: GitHubRepository[];
  activeRepository: GitHubRepository | null;
  isRepositoriesLoading: boolean;
  repositoriesError: string | null;

  // Metrics state
  metrics: any[];
  isMetricsLoading: boolean;
  metricsError: string | null;

  // OAuth logs state
  oauthLogs: any[];
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
