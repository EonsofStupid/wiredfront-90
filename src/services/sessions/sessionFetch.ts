import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { logger } from "@/services/chat/LoggingService";

export interface Session {
  id: string;
  title: string;
  created_at: string;
  last_accessed: string;
  is_active: boolean;
  metadata: Json;
  user_id: string;
  message_count?: number;
}

/**
 * Fetches all sessions for the current authenticated user
 */
export async function fetchUserSessions(): Promise<Session[]> {
  try {
    // Get user from Supabase auth
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      throw new Error("User not authenticated");
    }

    // Fetch chat sessions for the current user
    const { data, error } = await supabase
      .from("chat_sessions")
      .select(
        `
        id,
        title,
        created_at,
        last_accessed,
        is_active,
        metadata,
        user_id
      `
      )
      .eq("user_id", authData.user.id)
      .order("last_accessed", { ascending: false });

    if (error) throw error;

    // Get message counts for each session
    const sessionsWithCounts = await Promise.all(
      (data || []).map(async (session) => {
        const { count, error: countError } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("chat_session_id", session.id);

        if (countError) {
          logger.warn("Failed to get message count", {
            error: countError,
            sessionId: session.id,
          });
        }

        return {
          ...session,
          message_count: count || 0,
        } as Session;
      })
    );

    logger.info("Sessions fetched", { count: sessionsWithCounts.length });
    return sessionsWithCounts;
  } catch (error) {
    logger.error("Failed to fetch sessions", { error });
    throw error;
  }
}

interface SessionResponse {
  data: Session | null;
  error: Error | null;
}

export const fetchSessionById = async (
  sessionId: string
): Promise<SessionResponse> => {
  try {
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) throw error;

    return { data: data as Session, error: null };
  } catch (error) {
    logger.error("Error fetching session by ID:", error);
    return { data: null, error: error as Error };
  }
};
