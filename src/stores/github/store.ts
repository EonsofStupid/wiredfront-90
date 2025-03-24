
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { GithubSyncLog } from "@/types/github/sync";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GithubStore } from "./types";

const initialState = {
  // Connection state
  isConnected: false,
  isChecking: false,
  githubUsername: null,
  linkedAccounts: [],

  // Sync logs state
  logs: [],
  isLoading: false,
  error: null,
};

export const useGithubStore = create<GithubStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

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
            username: conn.username || "",
            default: !!conn.is_default
          }));

          set({
            isConnected: linkedAccounts.length > 0,
            githubUsername:
              linkedAccounts.find((acc) => acc.default)?.username || null,
            linkedAccounts,
          });
        } catch (error) {
          logger.error(
            "[GitHub Store] Failed to check connection status:",
            error
          );
          set({ error: "Failed to check connection status" });
        } finally {
          set({ isChecking: false });
        }
      },

      connectGitHub: async () => {
        try {
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
          set({ error: "Failed to connect to GitHub" });
        }
      },

      disconnectGitHub: async () => {
        try {
          const { error } = await supabase.functions.invoke("github-oauth", {
            body: { action: "disconnect" },
          });

          if (error) throw error;

          set({
            isConnected: false,
            githubUsername: null,
            linkedAccounts: [],
          });
        } catch (error) {
          logger.error(
            "[GitHub Store] Failed to disconnect from GitHub:",
            error
          );
          set({ error: "Failed to disconnect from GitHub" });
        }
      },

      setDefaultGitHubAccount: async (username: string) => {
        try {
          const { error } = await supabase
            .from("github_connections")
            .update({ is_default: false })
            .eq("is_default", true);

          if (error) throw error;

          const { error: updateError } = await supabase
            .from("github_connections")
            .update({ is_default: true })
            .eq("username", username);

          if (updateError) throw updateError;

          set((state) => ({
            githubUsername: username,
            linkedAccounts: state.linkedAccounts.map((acc) => ({
              ...acc,
              default: acc.username === username,
            })),
          }));
        } catch (error) {
          logger.error("[GitHub Store] Failed to set default account:", error);
          set({ error: "Failed to set default account" });
        }
      },

      // Sync logs actions
      fetchLogs: async (repositoryId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from("github_sync_logs")
            .select("*")
            .eq("repository_id", repositoryId)
            .order("synced_at", { ascending: false });

          if (error) throw error;
          
          const typedLogs: GithubSyncLog[] = data.map(log => ({
            id: log.id,
            repository_id: log.repository_id,
            status: log.status,
            synced_at: log.synced_at,
            message: log.message,
            duration_ms: log.duration_ms,
            triggered_by: log.triggered_by,
            created_at: log.created_at
          }));
          
          set({ logs: typedLogs });
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
            .select()
            .single();

          if (error) throw error;

          const typedLog: GithubSyncLog = {
            id: data.id,
            repository_id: data.repository_id,
            status: data.status,
            synced_at: data.synced_at,
            message: data.message,
            duration_ms: data.duration_ms,
            triggered_by: data.triggered_by,
            created_at: data.created_at
          };

          set((state) => ({
            logs: [typedLog, ...state.logs],
          }));
        } catch (error) {
          logger.error("[GitHub Store] Failed to add sync log:", error);
          set({ error: "Failed to add sync log" });
        }
      },
    }),
    {
      name: "github-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
