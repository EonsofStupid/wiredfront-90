
import { supabase } from "@/integrations/supabase/client";
import { Session } from "./types";
import { logger } from "@/services/chat/LoggingService";

/**
 * Fetch a specific chat session by ID
 */
export const fetchSessionById = async (sessionId: string): Promise<Session | null> => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) {
      logger.error("Error fetching session by ID:", error);
      return null;
    }

    return data as Session;
  } catch (error) {
    logger.error("Exception fetching session by ID:", error);
    return null;
  }
};

/**
 * Fetch all chat sessions for a user
 */
export const fetchUserSessions = async (): Promise<Session[]> => {
  try {
    // Get current user from supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn("No authenticated user found when fetching sessions");
      return [];
    }
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      logger.error("Error fetching user sessions:", error);
      return [];
    }

    return (data || []) as Session[];
  } catch (error) {
    logger.error("Exception fetching user sessions:", error);
    return [];
  }
};

/**
 * Fetch recent chat sessions for a user
 */
export const fetchRecentSessions = async (
  limit: number = 10
): Promise<Session[]> => {
  try {
    // Get current user from supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.warn("No authenticated user found when fetching recent sessions");
      return [];
    }
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      logger.error("Error fetching recent sessions:", error);
      return [];
    }

    return (data || []) as Session[];
  } catch (error) {
    logger.error("Exception fetching recent sessions:", error);
    return [];
  }
};
