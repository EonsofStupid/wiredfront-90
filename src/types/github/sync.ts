/**
 * GitHub Sync Status
 *
 * Represents the possible states of a GitHub sync operation.
 */
export type GithubSyncStatus = "success" | "error" | "queued" | "skipped";

/**
 * GitHub Sync Trigger
 *
 * Represents the different ways a sync operation can be triggered.
 */
export type GithubSyncTrigger = "manual" | "auto" | "webhook";

/**
 * GitHub Sync Log
 *
 * Represents a single sync operation log entry.
 */
export interface GithubSyncLog {
  id: string;
  repository_id: string;
  status: GithubSyncStatus;
  synced_at: string;
  message: string | null;
  duration_ms: number | null;
  triggered_by: GithubSyncTrigger;
  created_at: string;
}
