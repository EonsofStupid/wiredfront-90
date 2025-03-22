import { useChatStore } from "@/components/chat/store/chatStore";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { APIConfiguration } from "../apiKeyManagement";

export const useAPIKeyState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState<APIConfiguration[]>([]);
  const { updateChatProvider } = useChatStore();

  const fetchConfigurations = useCallback(async () => {
    setIsLoading(true);
    try {
      logger.info("Fetching API configurations...");

      const { data, error } = await supabase.functions.invoke(
        "manage-api-secret",
        {
          body: { action: "list" },
        }
      );

      if (error) {
        logger.error("Error fetching API configurations:", error);
        throw error;
      }

      if (data && data.configurations) {
        logger.info(`Fetched ${data.configurations.length} API configurations`);
        setConfigurations(data.configurations);

        // Update chat provider state with available configurations
        const chatProviders = data.configurations
          .filter(
            (config) =>
              ["openai", "anthropic", "gemini"].includes(config.api_type) &&
              config.is_enabled
          )
          .map((config) => ({
            id: config.id,
            name: config.memorable_name,
            type: config.api_type,
            isDefault: config.is_default,
          }));

        if (chatProviders.length > 0) {
          updateChatProvider(chatProviders);
          logger.info("Updated chat providers in store", {
            count: chatProviders.length,
          });
        }
      }
    } catch (error) {
      logger.error("Error fetching API configurations:", error);
      toast.error("Failed to fetch API configurations");
    } finally {
      setIsLoading(false);
    }
  }, [updateChatProvider]);

  useEffect(() => {
    fetchConfigurations();
  }, [fetchConfigurations]);

  return {
    isLoading,
    setIsLoading,
    configurations,
    setConfigurations,
    fetchConfigurations,
  };
};
