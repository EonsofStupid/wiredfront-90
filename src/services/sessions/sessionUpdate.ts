
import { supabase } from "@/integrations/supabase/client";
import { Session } from "./types";
import { UpdateSessionParams } from "@/types/sessions";
import { logger } from "@/services/chat/LoggingService";

/**
 * Update a chat session
 */
export const updateSession = async (
  sessionId: string, 
  updates: UpdateSessionParams
): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error("No authenticated user found when updating session");
      return false;
    }
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from("chat_sessions")
      .update({ 
        ...updates,
        updated_at: now 
      })
      .eq("id", sessionId)
      .eq("user_id", user.id); // Security: Only allow updating own sessions

    if (error) {
      logger.error("Error updating session:", error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Exception updating session:", error);
    return false;
  }
};

/**
 * Switch to a session (update last_accessed)
 */
export const switchToSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error("No authenticated user found when switching session");
      return false;
    }
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from("chat_sessions")
      .update({ 
        last_accessed: now,
        updated_at: now
      })
      .eq("id", sessionId)
      .eq("user_id", user.id); // Security: Only allow updating own sessions

    if (error) {
      logger.error("Error switching session:", error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Exception switching session:", error);
    return false;
  }
};
