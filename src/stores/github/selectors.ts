import { useGithubStore } from "./githubStore";

/**
 * Hook to get active repository sync status
 */
export const useActiveRepoSyncStatus = () =>
  useGithubStore((s) => ({
    status: s.activeRepository?.sync_status,
    lastSynced: s.activeRepository?.last_synced_at,
  }));

/**
 * Hook to get connection status
 */
export const useGitHubConnectionStatus = () =>
  useGithubStore((s) => ({
    isConnected: s.isConnected,
    isChecking: s.isChecking,
    status: s.connectionStatus.status,
    error: s.connectionStatus.errorMessage,
    lastCheck: s.connectionStatus.lastCheck,
  }));

/**
 * Hook to get linked accounts
 */
export const useGitHubLinkedAccounts = () =>
  useGithubStore((s) => ({
    accounts: s.linkedAccounts,
    defaultAccount: s.linkedAccounts.find((acc) => acc.default),
  }));

/**
 * Hook to get repositories
 */
export const useGitHubRepositories = () =>
  useGithubStore((s) => ({
    repositories: s.repositories,
    activeRepository: s.activeRepository,
    isLoading: s.isRepositoriesLoading,
    error: s.repositoriesError,
  }));

/**
 * Hook to get sync logs
 */
export const useGitHubSyncLogs = () =>
  useGithubStore((s) => ({
    logs: s.logs,
    isLoading: s.isLoading,
    error: s.error,
  }));

/**
 * Hook to get metrics
 */
export const useGitHubMetrics = () =>
  useGithubStore((s) => ({
    metrics: s.metrics,
    isLoading: s.isMetricsLoading,
    error: s.metricsError,
  }));

/**
 * Hook to get OAuth logs
 */
export const useGitHubOAuthLogs = () =>
  useGithubStore((s) => ({
    logs: s.oauthLogs,
    isLoading: s.isOAuthLogsLoading,
    error: s.oauthLogsError,
  }));
