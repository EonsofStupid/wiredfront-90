
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { GitHubRepository, GithubActions } from "../types/github-store-types";

/**
 * Feature-specific actions for the GitHub store
 */
export const createFeatureActions = (set: any, get: any): GithubActions => ({
  // Connection actions
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
            status: "disconnected",
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

      const linkedAccounts = connections.map((conn) => ({
        id: conn.id,
        username: conn.username || conn.account_username,
        avatar_url: conn.avatar_url,
        default: conn.is_default,
        status: conn.status,
        last_used: conn.last_used,
        token_expires_at: conn.token_expires_at,
        scopes: conn.scopes,
      }));

      const defaultAccount = linkedAccounts.find((acc) => acc.default);

      set({
        isConnected: linkedAccounts.length > 0,
        githubUsername: defaultAccount?.username || null,
        linkedAccounts,
        connectionStatus: {
          status: linkedAccounts.length > 0 ? "connected" : "disconnected",
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
      logger.error("[GitHub Store] Failed to check connection status:", error);
      set({
        error: "Failed to check connection status",
        connectionStatus: {
          status: "error",
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
          status: "connecting",
        },
      });

      const { data, error } = await supabase.functions.invoke("github-oauth", {
        body: { action: "connect" },
      });

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
          status: "error",
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
          status: "disconnected",
          lastCheck: new Date().toISOString(),
          errorMessage: null,
          lastSuccessfulOperation: null,
          connectionId: null,
          metadata: null,
        },
      });
    } catch (error) {
      logger.error("[GitHub Store] Failed to disconnect from GitHub:", error);
      set({
        error: "Failed to disconnect from GitHub",
        connectionStatus: {
          status: "error",
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

      set((state: any) => ({
        githubUsername:
          state.linkedAccounts.find((acc: any) => acc.id === accountId)
            ?.username || null,
        linkedAccounts: state.linkedAccounts.map((acc: any) => ({
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

      const linkedAccounts = connections.map((conn) => ({
        id: conn.id,
        username: conn.username || conn.account_username,
        avatar_url: conn.avatar_url,
        default: conn.is_default,
        status: conn.status,
        last_used: conn.last_used,
        token_expires_at: conn.token_expires_at,
        scopes: conn.scopes,
      }));

      set({ linkedAccounts });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch linked accounts:", error);
      set({ error: "Failed to fetch linked accounts" });
    }
  },

  // Repository actions - implementing the missing functions
  fetchRepositories: async () => {
    try {
      set({ isRepositoriesLoading: true, repositoriesError: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ repositories: [], isRepositoriesLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from("github_repositories")
        .select("*")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Map database repositories to our GitHubRepository type
      const repositories: GitHubRepository[] = data.map(repo => ({
        id: repo.id,
        connection_id: repo.connection_id,
        user_id: repo.user_id,
        repo_name: repo.repo_name,
        repo_owner: repo.repo_owner,
        repo_url: repo.repo_url,
        default_branch: repo.default_branch,
        is_active: repo.is_active,
        auto_sync: repo.auto_sync,
        last_synced_at: repo.last_synced_at,
        sync_status: repo.sync_status,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        html_url: repo.repo_url,
        metadata: repo.metadata,
        webhook_id: repo.webhook_id,
        webhook_secret: repo.webhook_secret,
        sync_frequency: repo.sync_frequency,
      }));
      
      set({ repositories, isRepositoriesLoading: false });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch repositories:", error);
      set({ 
        repositoriesError: error instanceof Error ? error.message : "Failed to fetch repositories",
        isRepositoriesLoading: false 
      });
    }
  },
  
  setActiveRepository: (repository: GitHubRepository | null) => {
    set({ activeRepository: repository });
  },
  
  // Metrics actions - implementing the missing function
  fetchMetrics: async () => {
    try {
      set({ isMetricsLoading: true, metricsError: null });
      
      const { data, error } = await supabase
        .from("github_metrics")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      set({ 
        metrics: data.map(metric => ({
          id: metric.id,
          metric_type: metric.metric_type,
          value: metric.value,
          timestamp: metric.timestamp,
          metadata: metric.metadata
        })),
        isMetricsLoading: false 
      });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch metrics:", error);
      set({ 
        metricsError: error instanceof Error ? error.message : "Failed to fetch metrics",
        isMetricsLoading: false 
      });
    }
  },
  
  // OAuth logs actions - implementing the missing function
  fetchOAuthLogs: async () => {
    try {
      set({ isOAuthLogsLoading: true, oauthLogsError: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ oauthLogs: [], isOAuthLogsLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from("github_oauth_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      set({ 
        oauthLogs: data.map(log => ({
          id: log.id,
          timestamp: log.timestamp,
          user_id: log.user_id,
          event_type: log.event_type,
          success: log.success,
          error_code: log.error_code,
          error_message: log.error_message,
          request_id: log.request_id,
          metadata: log.metadata
        })),
        isOAuthLogsLoading: false 
      });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch OAuth logs:", error);
      set({ 
        oauthLogsError: error instanceof Error ? error.message : "Failed to fetch OAuth logs",
        isOAuthLogsLoading: false 
      });
    }
  },

  // Sync logs actions
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

      set({ logs: transformedLogs });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch sync logs:", error);
      set({ error: "Failed to fetch sync logs" });
    } finally {
      set({ isLoading: false });
    }
  },

  refetch: () => {
    const logs = get().logs;
    if (logs.length > 0) {
      const repoId = logs[0].repository_id;
      get().fetchLogs(repoId);
    }
  },

  addLog: async (log) => {
    try {
      const { data, error } = await supabase
        .from("github_sync_logs")
        .insert([log])
        .select(
          `
          *,
          github_repositories (
            repo_name,
            repo_owner
          )
        `
        )
        .single();

      if (error) throw error;

      const transformedLog = {
        ...data,
        repo_name: data.github_repositories?.repo_name || "Unknown",
        repo_owner: data.github_repositories?.repo_owner || "Unknown",
      };

      set((state: any) => ({
        logs: [transformedLog, ...state.logs],
      }));
    } catch (error) {
      logger.error("[GitHub Store] Failed to add sync log:", error);
      set({ error: "Failed to add sync log" });
    }
  },
});
