
import { supabase } from "@/integrations/supabase/client";
import { Session } from "./types";
import { SessionOperationResult } from "@/types/sessions";

/**
 * Delete a chat session by ID
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found when deleting session");
      return false;
    }
    
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id); // Security: Only allow deleting own sessions

    if (error) {
      console.error("Error deleting session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception deleting session:", error);
    return false;
  }
};

/**
 * Clear all chat sessions (optionally preserving one)
 */
export const clearAllSessions = async (
  preserveSessionId: string | null = null
): Promise<SessionOperationResult> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found when clearing sessions");
      return { success: false, error: new Error("No authenticated user") };
    }
    
    let query = supabase
      .from("chat_sessions")
      .delete()
      .eq("user_id", user.id);
    
    // If preserving a session, add condition
    if (preserveSessionId) {
      query = query.neq("id", preserveSessionId);
    }
    
    const { error } = await query;

    if (error) {
      console.error("Error clearing sessions:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception clearing sessions:", error);
    return { success: false, error };
  }
};
