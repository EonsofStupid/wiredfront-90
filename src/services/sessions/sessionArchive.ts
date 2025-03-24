
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";

/**
 * Archive a chat session
 */
export const archiveSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error("No authenticated user found when archiving session");
      return false;
    }
    
    const now = new Date().toISOString();
    
    const { error } = await supabase
      .from("chat_sessions")
      .update({ 
        archived: true,
        updated_at: now 
      })
      .eq("id", sessionId)
      .eq("user_id", user.id); // Security: Only allow archiving own sessions

    if (error) {
      logger.error("Error archiving session:", error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Exception archiving session:", error);
    return false;
  }
};
