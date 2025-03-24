
import { supabase } from "@/integrations/supabase/client";
import { TokenEnforcementMode } from "@/integrations/supabase/types/enums";
import { logger } from "@/services/chat/LoggingService";
import { StateCreator } from "zustand";
import { ChatProvider, ChatIconStyle, ChatState } from "../types/chat-store-types";

interface InitializationActions {
  initializeChatSettings: () => Promise<void>;
}

type InitStore = ChatState & InitializationActions;
type InitSlice = Pick<InitStore, keyof InitializationActions>;

const DEFAULT_PROVIDER: ChatProvider = {
  id: "openai-default",
  name: "OpenAI",
  type: "openai",
  isDefault: true,
  category: "chat",
};

export const createInitializationActions: StateCreator<
  InitStore,
  [],
  [],
  InitSlice
> = (set, get, store) => ({
  initializeChatSettings: async () => {
    try {
      logger.info("Initializing chat settings");
      set({ initialized: false });

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

          // Always set OpenAI as the default provider if available
          const openaiProvider = data.availableProviders.find(
            (p: ChatProvider) => p.type === "openai"
          );

          set({
            availableProviders: data.availableProviders,
            currentProvider: openaiProvider || data.defaultProvider,
            providers: {
              availableProviders: data.availableProviders,
            },
          });

          logger.info("Set current provider", {
            provider: openaiProvider
              ? openaiProvider.name
              : data.defaultProvider?.name,
          });
        }
      } catch (providerError) {
        logger.error(
          "Failed to load providers from edge function",
          providerError
        );

        set({
          availableProviders: [DEFAULT_PROVIDER],
          currentProvider: DEFAULT_PROVIDER,
        });

        logger.info("Set fallback OpenAI provider");
      }

      // Then, try to load user chat settings from the database
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        logger.info("User authenticated, loading settings from database");

        // Load chat settings
        const { data: chatSettings, error: settingsError } = await supabase
          .from("chat_settings")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (settingsError && settingsError.code !== "PGRST116") {
          // PGRST116 is "no rows returned"
          logger.error("Error loading chat settings", settingsError);
        }

        // Load user chat preferences (including icon style)
        const { data: chatPreferences, error: prefsError } = await supabase
          .from("user_chat_preferences")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (prefsError && prefsError.code !== "PGRST116") {
          logger.error("Error loading chat preferences", prefsError);
        }

        if (chatSettings) {
          logger.info("Chat settings loaded from database");

          const currentState = get();
          const uiCustomizations = chatSettings.ui_customizations || {};

          // Type guard for features
          const features =
            typeof uiCustomizations === "object" &&
            "features" in uiCustomizations
              ? (uiCustomizations.features as Record<string, boolean>)
              : {};

          // Type guard for token control
          const tokenControl =
            typeof uiCustomizations === "object" &&
            "tokenControl" in uiCustomizations
              ? (uiCustomizations.tokenControl as Record<string, any>)
              : {};

          // Type guard for token enforcement
          const tokenEnforcement =
            typeof uiCustomizations === "object" &&
            "tokenEnforcement" in uiCustomizations
              ? (uiCustomizations.tokenEnforcement as TokenEnforcementMode)
              : ("never" as TokenEnforcementMode);

          set({
            features: {
              ...currentState.features,
              ...features,
            },
            tokenControl: {
              ...currentState.tokenControl,
              enforcementMode: tokenEnforcement,
              ...tokenControl,
            },
          });
        }

        if (chatPreferences) {
          logger.info("Chat preferences loaded from database", chatPreferences);
          
          // Apply the user's chat icon style preference
          set({
            iconStyle: (chatPreferences.icon_style || 'default') as ChatIconStyle,
            // If position is set in preferences, use it
            position: chatPreferences.position || get().position
          });
        }
      }

      // If no provider is set, use OpenAI as default
      const currentState = get();
      if (!currentState.currentProvider) {
        set({
          currentProvider: DEFAULT_PROVIDER,
          availableProviders: [
            ...(currentState.availableProviders || []),
            DEFAULT_PROVIDER,
          ],
        });

        logger.info("Set default OpenAI provider as fallback");
      }

      // Finally, mark initialization as complete
      set({ initialized: true });
      logger.info("Chat settings initialization complete");
    } catch (error) {
      logger.error("Failed to initialize chat settings", error);
      set({
        initialized: true,
        error: "Failed to initialize chat settings",
      });
    }
  },
});
