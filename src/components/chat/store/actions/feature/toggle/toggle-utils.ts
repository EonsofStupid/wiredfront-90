import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

/**
 * Log feature toggle changes to the database
 */
export const logFeatureToggle = async (
  featureName: string,
  newValue: boolean,
  oldValue?: boolean
) => {
  try {
    logger.info(`Feature toggle changed: ${featureName}`, {
      oldValue,
      newValue,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("feature_toggle_history").insert({
        user_id: user.id,
        feature_name: featureName,
        old_value: oldValue,
        new_value: newValue,
        metadata: { source: "client_app" },
      });
    }
  } catch (error) {
    logger.error(`Failed to log feature toggle: ${featureName}`, error);
  }
};

/**
 * Log provider changes to the database
 */
export const logProviderChange = async (
  oldProvider?: string,
  newProvider?: string
) => {
  try {
    logger.info(
      `Provider changed from ${oldProvider || "none"} to ${
        newProvider || "none"
      }`
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("provider_change_log").insert({
        user_id: user.id,
        old_provider: oldProvider || null,
        new_provider: newProvider || "unknown",
        provider_name: newProvider || "unknown",
        reason: "user_selection",
        metadata: {
          source: "client",
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    logger.error("Failed to log provider change", error);
  }
};

/**
 * Log command usage to the database
 */
export const logCommandUsage = async (commandName: string, args: string[]) => {
  try {
    logger.info(`Command used: /${commandName}`, { args });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("feature_usage").insert({
        user_id: user.id,
        feature_name: `command_${commandName}`,
        count: 1,
        context: {
          command: commandName,
          args: args,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    logger.error(`Failed to log command usage: ${commandName}`, error);
  }
};
