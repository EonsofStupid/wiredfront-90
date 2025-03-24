import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { GithubActions } from "../types/github-store-types";

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
        username: conn.github_username,
        default: conn.is_default,
      }));

      set({
        isConnected: linkedAccounts.length > 0,
        githubUsername:
          linkedAccounts.find((acc) => acc.default)?.username || null,
        linkedAccounts,
        connectionStatus: {
          status: linkedAccounts.length > 0 ? "connected" : "disconnected",
          lastCheck: new Date().toISOString(),
          errorMessage: null,
          metadata: {
            username: linkedAccounts.find((acc) => acc.default)?.username,
            scopes: connections[0]?.scopes,
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
        username: conn.github_username,
        default: conn.is_default,
      }));

      set({ linkedAccounts });
    } catch (error) {
      logger.error("[GitHub Store] Failed to fetch linked accounts:", error);
      set({ error: "Failed to fetch linked accounts" });
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
