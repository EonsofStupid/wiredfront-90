
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { GithubSyncLog } from "@/types/github/sync";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  GitHubConnectionStatus,
  GitHubConnectionStatusProps,
  GitHubLinkedAccount,
  GitHubRepository,
  GitHubMetric,
  GitHubOAuthLog,
  GithubStore,
} from "./types/github-store-types";
import { createFeatureActions } from "./features/actions";

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
      // ✅ Include all actions from feature module
      // --------------------------------
      ...createFeatureActions(set, get),
    }),
    { name: "github-store" }
  )
);
