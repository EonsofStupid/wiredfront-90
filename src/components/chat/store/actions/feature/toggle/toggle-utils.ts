
import { ChatProvider } from "@/components/chat/store/types/chat-store-types";
import { logger } from "@/services/chat/LoggingService";
import { supabase } from "@/integrations/supabase/client";

/**
 * Log provider change in the database
 */
export const logProviderChange = async (
  oldProvider?: string,
  newProvider?: string,
  reason?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.info("Not logging provider change - user not authenticated");
      return;
    }
    
    // Only log when there's a real change
    if (oldProvider === newProvider) {
      return;
    }
    
    const { error } = await supabase.from("provider_change_log").insert({
      user_id: user.id,
      old_provider: oldProvider || null,
      new_provider: newProvider || "unknown",
      reason: reason || "manual_switch",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      logger.error("Failed to log provider change", { error });
    } else {
      logger.info("Logged provider change", { oldProvider, newProvider });
    }
  } catch (e) {
    logger.error("Error logging provider change", e);
  }
};

/**
 * Save the user's chat style preferences to the database
 */
export const saveUserChatPreferences = async (
  preferences: {
    iconStyle?: 'default' | 'wfpulse' | 'retro';
    theme?: string;
    position?: string;
    docked?: boolean;
  }
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.info("Not saving preferences - user not authenticated");
      return false;
    }
    
    // Check if user already has preferences
    const { data: existingPrefs, error: fetchError } = await supabase
      .from("user_chat_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 means no rows returned
      logger.error("Error fetching user preferences", { error: fetchError });
      return false;
    }
    
    // Prepare the data to save
    const prefsData = {
      user_id: user.id,
      ...preferences
    };
    
    let result;
    
    if (existingPrefs) {
      // Update existing preferences
      result = await supabase
        .from("user_chat_preferences")
        .update(prefsData)
        .eq("user_id", user.id);
    } else {
      // Insert new preferences
      result = await supabase
        .from("user_chat_preferences")
        .insert(prefsData);
    }
    
    if (result.error) {
      logger.error("Failed to save user preferences", { error: result.error });
      return false;
    }
    
    logger.info("Saved user preferences", { preferences });
    return true;
  } catch (e) {
    logger.error("Error saving user preferences", e);
    return false;
  }
};

/**
 * Load the user's chat style preferences from the database
 */
export const loadUserChatPreferences = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.info("Not loading preferences - user not authenticated");
      return null;
    }
    
    const { data, error } = await supabase
      .from("user_chat_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    if (error) {
      logger.error("Error loading user preferences", { error });
      return null;
    }
    
    logger.info("Loaded user preferences", { preferences: data });
    return data;
  } catch (e) {
    logger.error("Error loading user preferences", e);
    return null;
  }
};
