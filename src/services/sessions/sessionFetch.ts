
// This is a partial fix. We need to address the excessive type depth error
// by limiting recursive type definitions and adding explicit type annotations

import { supabase } from "@/integrations/supabase/client";
import { Session } from "../types";

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
      console.error("Error fetching session by ID:", error);
      return null;
    }

    return data as Session;
  } catch (error) {
    console.error("Exception fetching session by ID:", error);
    return null;
  }
};

/**
 * Fetch all chat sessions for a user
 */
export const fetchUserSessions = async (userId: string): Promise<Session[]> => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching user sessions:", error);
      return [];
    }

    // Use explicit type annotation to prevent excessive type depth
    const sessions: Session[] = data || [];
    return sessions;
  } catch (error) {
    console.error("Exception fetching user sessions:", error);
    return [];
  }
};

/**
 * Fetch recent chat sessions for a user
 */
export const fetchRecentSessions = async (
  userId: string,
  limit: number = 10
): Promise<Session[]> => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent sessions:", error);
      return [];
    }

    // Use explicit type annotation to prevent excessive type depth
    const sessions: Session[] = data || [];
    return sessions;
  } catch (error) {
    console.error("Exception fetching recent sessions:", error);
    return [];
  }
};
