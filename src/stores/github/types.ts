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
  metadata: {
    username?: string;
    scopes?: string[];
    [key: string]: any;
  } | null;
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
