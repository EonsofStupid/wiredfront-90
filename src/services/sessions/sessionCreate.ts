
import { supabase } from "@/integrations/supabase/client";
import { Session } from "./types";
import { ChatMode } from "@/integrations/supabase/types/enums";
import { CreateSessionParams, SessionOperationResult } from "@/types/sessions";
import { logger } from "@/services/chat/LoggingService";

/**
 * Validates if the provided mode is a valid ChatMode
 */
const isValidChatMode = (mode: string): mode is ChatMode => {
  const validModes: ChatMode[] = ["chat", "image", "dev", "training", "planning", "code"];
  return validModes.includes(mode as ChatMode);
};

/**
 * Create a new chat session
 */
export const createNewSession = async (params?: CreateSessionParams): Promise<SessionOperationResult> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      logger.error("No authenticated user found when creating session");
      return { success: false, error: new Error("No authenticated user") };
    }

    const title = params?.title || "New Chat";
    const metadata = params?.metadata || {};
    
    // Validate and normalize the mode
    let mode: ChatMode = "chat"; // Default mode
    if (params?.mode) {
      if (isValidChatMode(params.mode)) {
        mode = params.mode;
      } else {
        logger.warn(`Invalid mode "${params.mode}" specified, falling back to "chat"`);
      }
    }
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("chat_sessions")
      .insert({
        title, 
        user_id: user.id,
        created_at: now,
        updated_at: now,
        last_accessed: now,
        message_count: 0,
        archived: false,
        metadata,
        mode,
        project_id: params?.project_id,
        provider_id: params?.provider_id
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating session:", error);
      return { success: false, error };
    }

    return { 
      success: true, 
      sessionId: (data as Session).id 
    };
  } catch (error) {
    logger.error("Exception creating session:", error);
    return { success: false, error };
  }
};
