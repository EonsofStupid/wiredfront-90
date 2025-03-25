import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { Provider, ProviderCategory } from "@/types/providers";
import { ChatState } from "../types/chat-store-types";

type SetState = (
  state: Partial<ChatState>,
  replace?: boolean,
  action?: any
) => void;
type GetState = () => ChatState;

export const createInitializationActions = (set: SetState, get: GetState) => ({
  /**
   * Initialize chat settings from the database or local storage
   */
  initializeChatSettings: async () => {
    try {
      logger.info("Initializing chat settings");
      set({ initialized: false }, false, { type: "initialization/start" });

      // First, try to load providers from Supabase edge function
      try {
        const { data, error } = await supabase.functions.invoke(
          "initialize-providers"
        );

        if (error) {
          logger.error("Error initializing providers", error);
        } else if (data && data.availableProviders) {
          logger.info("Loaded available providers", {
            count: data.availableProviders.length,
          });

          // Initialize providers
          const providers = data?.providers || [];
          const providerCategories = providers.map(
            (provider: Provider) => provider.category
          );

          // Find OpenAI provider category if available
          const openaiProvider = providerCategories.find(
            (category: ProviderCategory) => category === "ai"
          );

          set({
            providers: {
              loading: false,
              error: null,
              availableProviders: providerCategories,
            },
            availableProviders: providerCategories,
            currentProvider: openaiProvider || providerCategories[0] || null,
          });

          logger.info("Set current provider", {
            provider: openaiProvider
              ? openaiProvider.name
              : providerCategories[0]?.name,
          });
        }
      } catch (providerError) {
        logger.error(
          "Failed to load providers from edge function",
          providerError
        );

        // Fallback to default OpenAI provider if edge function fails
        set({
          availableProviders: ["ai"],
          currentProvider: "ai",
          providers: {
            loading: false,
            error: null,
            availableProviders: ["ai"],
          },
        });

        logger.info("Set fallback OpenAI provider");
      }

      // Then, try to load user chat settings from the database
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        logger.info("User authenticated, loading settings from database");

        const { data: chatSettings, error: settingsError } = await supabase
          .from("chat_settings")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          // PGRST116 is "no rows returned"
          logger.error("Error loading chat settings", settingsError);
        }

        if (chatSettings) {
          logger.info("Chat settings loaded from database");

          // Safely handle nested properties with proper type checking
          const uiCustomizations = chatSettings.ui_customizations || {};
          const currentState = get();

          // Apply settings from database with proper type safety
          set({
            features: {
              voice: uiCustomizations.voice || false,
              rag: uiCustomizations.rag || false,
              modeSwitch: uiCustomizations.modeSwitch || false,
              notifications: uiCustomizations.notifications || false,
              github: uiCustomizations.github || false,
              codeAssistant: uiCustomizations.codeAssistant || false,
              ragSupport: uiCustomizations.ragSupport || false,
              githubSync: uiCustomizations.githubSync || false,
              tokenEnforcement: uiCustomizations.tokenEnforcement || false,
            },
            tokenControl: {
              mode: uiCustomizations.tokenControl?.mode || "NONE",
              balance: uiCustomizations.tokenControl?.balance || 0,
              queriesUsed: uiCustomizations.tokenControl?.queriesUsed || 0,
              enforcementMode:
                uiCustomizations.tokenControl?.enforcementMode || "NONE",
            },
          });
        }
      }

      // If no provider is set, use OpenAI as default
      const currentState = get();
      if (!currentState.currentProvider) {
        set({
          currentProvider: "ai",
          availableProviders: [
            ...(currentState.availableProviders || []),
            "ai",
          ],
          providers: {
            loading: false,
            error: null,
            availableProviders: [
              ...(currentState.availableProviders || []),
              "ai",
            ],
          },
        });

        logger.info("Set default OpenAI provider as fallback");
      }

      // Finally, mark initialization as complete
      set({ initialized: true }, false, { type: "initialization/complete" });
      logger.info("Chat settings initialization complete");
    } catch (error) {
      logger.error("Failed to initialize chat settings", error);
      set(
        { initialized: true, error: "Failed to initialize chat settings" },
        false,
        {
          type: "initialization/error",
          error,
        }
      );
    }
  },
});
