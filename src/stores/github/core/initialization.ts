import { GithubState } from "../types/github-store-types";

/**
 * Initial state for the GitHub store
 */
export const initialState: GithubState = {
  // Connection state
  isConnected: false,
  isChecking: false,
  connectionStatus: {
    status: "unknown",
    lastCheck: null,
    errorMessage: null,
    lastSuccessfulOperation: null,
    connectionId: null,
    metadata: null,
  },
  githubUsername: null,
  linkedAccounts: [],

  // Repository state
  repositories: [],
  activeRepository: null,
  isRepositoriesLoading: false,
  repositoriesError: null,

  // Metrics state
  metrics: [],
  isMetricsLoading: false,
  metricsError: null,

  // OAuth logs state
  oauthLogs: [],
  isOAuthLogsLoading: false,
  oauthLogsError: null,

  // Sync logs state
  logs: [],
  isLoading: false,
  error: null,
};
