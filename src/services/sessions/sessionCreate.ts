
import { supabase } from "@/integrations/supabase/client";
import { Session } from "./types";
import { CreateSessionParams, SessionOperationResult } from "@/types/sessions";

/**
 * Create a new chat session
 */
export const createNewSession = async (params?: CreateSessionParams): Promise<SessionOperationResult> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found when creating session");
      return { success: false, error: new Error("No authenticated user") };
    }

    const title = params?.title || "New Chat";
    const metadata = params?.metadata || {};
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert([
        { 
          title, 
          user_id: user.id,
          created_at: now,
          updated_at: now,
          last_accessed: now,
          message_count: 0,
          metadata 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return { success: false, error };
    }

    return { 
      success: true, 
      sessionId: (data as Session).id 
    };
  } catch (error) {
    console.error("Exception creating session:", error);
    return { success: false, error };
  }
};
