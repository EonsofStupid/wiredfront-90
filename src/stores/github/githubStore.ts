import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { GithubSyncLog } from "@/types/github/sync";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  GitHubConnectionStatus,
  GitHubConnectionStatusProps,
  GitHubConnectionStatusType,
  GitHubLinkedAccount,
  GitHubMetric,
  GitHubOAuthLog,
  GitHubRepository,
  GithubStore,
} from "./types/github-store-types";

/**
 * GitHub Store
 *
 * Manages GitHub connection state and sync logs
 */
export const useGithubStore = create<GithubStore>()(
  devtools(
    (set, get) => ({
      // --------------------------------
      // ✅ Initial State
      // --------------------------------
      isConnected: false,
      isChecking: false,
      connectionStatus: {
        status: "unknown" as GitHubConnectionStatus,
        lastCheck: null,
        errorMessage: null,
        lastSuccessfulOperation: null,
        connectionId: null,
        metadata: null,
      },
      githubUsername: null,
      linkedAccounts: [],

      repositories: [],
      activeRepository: null,
      isRepositoriesLoading: false,
      repositoriesError: null,

      metrics: [],
      isMetricsLoading: false,
      metricsError: null,

      oauthLogs: [],
      isOAuthLogsLoading: false,
      oauthLogsError: null,

      logs: [],
      isLoading: false,
      error: null,

      // --------------------------------
      // ✅ Connection Actions
      // --------------------------------
      checkConnectionStatus: async () => {
        try {
          set({ isChecking: true });
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            set({
              isConnected: false,
              githubUsername: null,
              linkedAccounts: [],
              connectionStatus: {
                status: "disconnected" as GitHubConnectionStatus,
                lastCheck: new Date().toISOString(),
                errorMessage: null,
                lastSuccessfulOperation: null,
                connectionId: null,
                metadata: null,
              },
            });
            return;
          }

          const { data: connections, error } = await supabase
            .from("github_connections")
            .select("*")
            .eq("user_id", user.id);

          if (error) throw error;

          const linkedAccounts: GitHubLinkedAccount[] = connections.map(
            (conn) => ({
              id: conn.id,
              username: conn.github_username,
              avatar_url: conn.avatar_url,
              default: conn.is_default,
              status: conn.status as GitHubConnectionStatusType,
              last_used: conn.last_used,
              token_expires_at: conn.token_expires_at,
              scopes: conn.scopes,
            })
          );

          const defaultAccount = linkedAccounts.find((acc) => acc.default);

          set({
            isConnected: linkedAccounts.length > 0,
            githubUsername: defaultAccount?.username || null,
            linkedAccounts,
            connectionStatus: {
              status:
                linkedAccounts.length > 0
                  ? ("connected" as GitHubConnectionStatus)
                  : ("disconnected" as GitHubConnectionStatus),
              lastCheck: new Date().toISOString(),
              errorMessage: null,
              lastSuccessfulOperation: new Date().toISOString(),
              connectionId: defaultAccount?.id || null,
              metadata: {
                username: defaultAccount?.username,
                scopes: defaultAccount?.scopes,
              },
            },
          });
        } catch (error) {
          logger.error(
            "[GitHub Store] Failed to check connection status:",
            error
          );
          set({
            error: "Failed to check connection status",
            connectionStatus: {
              status: "error" as GitHubConnectionStatus,
              lastCheck: new Date().toISOString(),
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              lastSuccessfulOperation: null,
              connectionId: null,
              metadata: null,
            },
          });
        } finally {
          set({ isChecking: false });
        }
      },

      connectGitHub: async () => {
        try {
          set({
            connectionStatus: {
              ...get().connectionStatus,
              status: "connecting" as GitHubConnectionStatus,
            },
          });

          const { data, error } = await supabase.functions.invoke(
            "github-oauth",
            {
              body: { action: "connect" },
            }
          );

          if (error) throw error;

          // Open popup for GitHub OAuth
          const popup = window.open(
            data.url,
            "GitHub OAuth",
            "width=600,height=600"
          );

          // Check connection status after popup closes
          const checkInterval = setInterval(async () => {
            if (popup?.closed) {
              clearInterval(checkInterval);
              await get().checkConnectionStatus();
            }
          }, 1000);
        } catch (error) {
          logger.error("[GitHub Store] Failed to connect to GitHub:", error);
          set({
            error: "Failed to connect to GitHub",
            connectionStatus: {
              status: "error" as GitHubConnectionStatus,
              lastCheck: new Date().toISOString(),
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              lastSuccessfulOperation: null,
              connectionId: null,
              metadata: null,
            },
          });
        }
      },

      disconnectGitHub: async (accountId?: string) => {
        try {
          const { error } = await supabase.functions.invoke("github-oauth", {
            body: {
              action: "disconnect",
              accountId,
            },
          });

          if (error) throw error;

          set({
            isConnected: false,
            githubUsername: null,
            linkedAccounts: [],
            connectionStatus: {
              status: "disconnected" as GitHubConnectionStatus,
              lastCheck: new Date().toISOString(),
              errorMessage: null,
              lastSuccessfulOperation: null,
              connectionId: null,
              metadata: null,
            },
          });
        } catch (error) {
          logger.error(
            "[GitHub Store] Failed to disconnect from GitHub:",
            error
          );
          set({
            error: "Failed to disconnect from GitHub",
            connectionStatus: {
              status: "error" as GitHubConnectionStatus,
              lastCheck: new Date().toISOString(),
              errorMessage:
                error instanceof Error ? error.message : "Unknown error",
              lastSuccessfulOperation: null,
              connectionId: null,
              metadata: null,
            },
          });
        }
      },

      setDefaultGitHubAccount: async (accountId: string) => {
        try {
          const { error } = await supabase
            .from("github_connections")
            .update({ is_default: false })
            .eq("is_default", true);

          if (error) throw error;

          const { error: updateError } = await supabase
            .from("github_connections")
            .update({ is_default: true })
            .eq("id", accountId);

          if (updateError) throw updateError;

          set((state) => ({
            githubUsername:
              state.linkedAccounts.find((acc) => acc.id === accountId)
                ?.username || null,
            linkedAccounts: state.linkedAccounts.map((acc) => ({
              ...acc,
              default: acc.id === accountId,
            })),
          }));
        } catch (error) {
          logger.error("[GitHub Store] Failed to set default account:", error);
          set({ error: "Failed to set default account" });
        }
      },

      fetchLinkedAccounts: async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          const { data: connections, error } = await supabase
            .from("github_connections")
            .select("*")
            .eq("user_id", user.id);

          if (error) throw error;

          const linkedAccounts: GitHubLinkedAccount[] = connections.map(
            (conn) => ({
              id: conn.id,
              username: conn.github_username,
              avatar_url: conn.avatar_url,
              default: conn.is_default,
              status: conn.status as GitHubConnectionStatusType,
              last_used: conn.last_used,
              token_expires_at: conn.token_expires_at,
              scopes: conn.scopes,
            })
          );

          set({ linkedAccounts });
        } catch (error) {
          logger.error(
            "[GitHub Store] Failed to fetch linked accounts:",
            error
          );
          set({ error: "Failed to fetch linked accounts" });
        }
      },

      updateConnectionStatus: async (
        status: Partial<GitHubConnectionStatusProps>
      ) => {
        set((prev) => ({
          connectionStatus: {
            ...prev.connectionStatus,
            ...status,
          },
        }));
      },

      // --------------------------------
      // ✅ Repository Actions
      // --------------------------------
      fetchRepositories: async (connectionId: string) => {
        try {
          set({ isRepositoriesLoading: true, repositoriesError: null });
          const { data, error } = await supabase
            .from("github_repositories")
            .select("*")
            .eq("connection_id", connectionId);

          if (error) throw error;
          set({ repositories: data ?? [], isRepositoriesLoading: false });
        } catch (error) {
          logger.error("[GitHub Store] Failed to fetch repositories:", error);
          set({
            repositoriesError:
              error instanceof Error ? error.message : "Unknown error",
            isRepositoriesLoading: false,
          });
        }
      },

      addRepository: async (
        repository: Omit<GitHubRepository, "id" | "created_at" | "updated_at">
      ) => {
        try {
          const { error } = await supabase
            .from("github_repositories")
            .insert([repository]);

          if (error) throw error;
          await get().refetch();
        } catch (error) {
          logger.error("[GitHub Store] Failed to add repository:", error);
          set({
            repositoriesError:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      updateRepository: async (
        id: string,
        updates: Partial<GitHubRepository>
      ) => {
        try {
          const { error } = await supabase
            .from("github_repositories")
            .update(updates)
            .eq("id", id);

          if (error) throw error;
          await get().refetch();
        } catch (error) {
          logger.error("[GitHub Store] Failed to update repository:", error);
          set({
            repositoriesError:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      deleteRepository: async (id: string) => {
        try {
          const { error } = await supabase
            .from("github_repositories")
            .delete()
            .eq("id", id);

          if (error) throw error;
          await get().refetch();
        } catch (error) {
          logger.error("[GitHub Store] Failed to delete repository:", error);
          set({
            repositoriesError:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      setRepositoryActive: async (id: string, isActive: boolean) => {
        await get().updateRepository(id, { is_active: isActive });
      },

      setRepositoryAutoSync: async (id: string, autoSync: boolean) => {
        await get().updateRepository(id, { auto_sync: autoSync });
      },

      updateRepositoryWebhook: async (
        id: string,
        webhookSecret: string,
        webhookId: string
      ) => {
        await get().updateRepository(id, {
          webhook_secret: webhookSecret,
          webhook_id: webhookId,
        });
      },

      setRepositorySyncFrequency: async (
        id: string,
        frequency: GitHubRepository["sync_frequency"]
      ) => {
        await get().updateRepository(id, { sync_frequency: frequency });
      },

      setActiveRepository: (repository: GitHubRepository | null) => {
        set({ activeRepository: repository });
      },

      // --------------------------------
      // ✅ Metrics Actions
      // --------------------------------
      fetchMetrics: async (repositoryId: string, metricType?: string) => {
        try {
          set({ isMetricsLoading: true, metricsError: null });
          let query = supabase
            .from("github_metrics")
            .select("*")
            .eq("repository_id", repositoryId);

          if (metricType) {
            query = query.eq("metric_type", metricType);
          }

          const { data, error } = await query;

          if (error) throw error;
          set({ metrics: data ?? [], isMetricsLoading: false });
        } catch (error) {
          logger.error("[GitHub Store] Failed to fetch metrics:", error);
          set({
            metricsError:
              error instanceof Error ? error.message : "Unknown error",
            isMetricsLoading: false,
          });
        }
      },

      addMetric: async (metric: Omit<GitHubMetric, "id" | "timestamp">) => {
        try {
          const { error } = await supabase
            .from("github_metrics")
            .insert([metric]);

          if (error) throw error;
          await get().fetchMetrics(metric.repository_id, metric.metric_type);
        } catch (error) {
          logger.error("[GitHub Store] Failed to add metric:", error);
          set({
            metricsError:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      getMetricHistory: async (
        repositoryId: string,
        metricType: string,
        timeRange: string
      ) => {
        try {
          const { data, error } = await supabase
            .from("github_metrics")
            .select("*")
            .eq("repository_id", repositoryId)
            .eq("metric_type", metricType)
            .gte(
              "timestamp",
              new Date(Date.now() - getTimeRangeInMs(timeRange)).toISOString()
            );

          if (error) throw error;
          return data ?? [];
        } catch (error) {
          logger.error("[GitHub Store] Failed to get metric history:", error);
          return [];
        }
      },

      // --------------------------------
      // ✅ OAuth Log Actions
      // --------------------------------
      fetchOAuthLogs: async (userId?: string) => {
        try {
          set({ isOAuthLogsLoading: true, oauthLogsError: null });
          let query = supabase.from("github_oauth_logs").select("*");

          if (userId) {
            query = query.eq("user_id", userId);
          }

          const { data, error } = await query;

          if (error) throw error;
          set({ oauthLogs: data ?? [], isOAuthLogsLoading: false });
        } catch (error) {
          logger.error("[GitHub Store] Failed to fetch OAuth logs:", error);
          set({
            oauthLogsError:
              error instanceof Error ? error.message : "Unknown error",
            isOAuthLogsLoading: false,
          });
        }
      },

      addOAuthLog: async (log: Omit<GitHubOAuthLog, "id" | "created_at">) => {
        try {
          const { error } = await supabase
            .from("github_oauth_logs")
            .insert([log]);

          if (error) throw error;
          await get().fetchOAuthLogs(log.user_id);
        } catch (error) {
          logger.error("[GitHub Store] Failed to add OAuth log:", error);
          set({
            oauthLogsError:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      // --------------------------------
      // ✅ Sync Log Actions
      // --------------------------------
      fetchLogs: async (repositoryId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("github_sync_logs")
            .select(
              `
              *,
              github_repositories (
                repo_name,
                repo_owner
              )
            `
            )
            .eq("repository_id", repositoryId)
            .order("synced_at", { ascending: false });

          if (error) throw error;

          const transformedLogs = data.map((log) => ({
            ...log,
            repo_name: log.github_repositories?.repo_name || "Unknown",
            repo_owner: log.github_repositories?.repo_owner || "Unknown",
          }));

          set({ logs: transformedLogs, isLoading: false });
        } catch (error) {
          logger.error("[GitHub Store] Failed to fetch sync logs:", error);
          set({
            error: error instanceof Error ? error.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      addLog: async (log: Omit<GithubSyncLog, "id" | "created_at">) => {
        try {
          const { error } = await supabase
            .from("github_sync_logs")
            .insert([log]);

          if (error) throw error;
          await get().fetchLogs(log.repository_id);
        } catch (error) {
          logger.error("[GitHub Store] Failed to add sync log:", error);
          set({
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      refetch: () => {
        const active = get().activeRepository;
        if (active) {
          get().fetchRepositories(active.connection_id);
          get().fetchLogs(active.id);
        }
      },
    }),
    {
      name: "GitHubStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

// Helper function to convert time range string to milliseconds
function getTimeRangeInMs(timeRange: string): number {
  const value = parseInt(timeRange.slice(0, -1));
  const unit = timeRange.slice(-1);

  switch (unit) {
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "w":
      return value * 7 * 24 * 60 * 60 * 1000;
    case "m":
      return value * 30 * 24 * 60 * 60 * 1000;
    default:
      return 24 * 60 * 60 * 1000; // Default to 1 day
  }
}
