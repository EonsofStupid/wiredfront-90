import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/chat/LoggingService";
import { useChatStore } from "@/stores/chat/chatStore";
import { ChatMode, DBSession, Session } from "@/types/chat";
import { handleError } from "@/utils/errorHandling";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface CreateSessionOptions {
  title?: string;
  metadata?: Record<string, any>;
}

export function useSessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSessionLoading } = useChatStore();

  const refreshSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setSessionLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("last_accessed", { ascending: false });

      if (error) throw error;

      const formattedSessions = (data || []).map(
        (session: DBSession): Session => ({
          id: session.id,
          title: session.title,
          user_id: session.user_id,
          created_at: session.created_at,
          last_accessed: session.last_accessed,
          is_active: session.is_active || false,
          mode: session.mode || "chat",
          provider_id: session.provider_id || "",
          project_id: session.project_id || "",
          tokens_used: session.tokens_used || 0,
          message_count: session.message_count || 0,
          metadata: session.metadata
            ? ((typeof session.metadata === "string"
                ? JSON.parse(session.metadata)
                : session.metadata) as Record<string, any>)
            : {},
          context: session.context
            ? ((typeof session.context === "string"
                ? JSON.parse(session.context)
                : session.context) as Record<string, any>)
            : {},
        })
      );

      setSessions(formattedSessions);

      // If we have sessions but no current session, set the first one
      if (formattedSessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(formattedSessions[0].id);
      }

      logger.info("Sessions refreshed", { count: formattedSessions.length });
      return formattedSessions;
    } catch (error) {
      handleError(error, "Failed to refresh sessions");
      return [];
    } finally {
      setIsLoading(false);
      setSessionLoading(false);
    }
  }, [currentSessionId, setSessionLoading]);

  const createSession = useCallback(
    async (options: CreateSessionOptions = {}) => {
      try {
        setIsLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("User not authenticated");

        const sessionId = uuidv4();
        const now = new Date().toISOString();

        const newSession = {
          id: sessionId,
          title: options.title || `New Chat ${new Date().toLocaleString()}`,
          user_id: user.id,
          created_at: now,
          last_accessed: now,
          is_active: true,
          metadata: options.metadata || {},
          mode: "chat" as ChatMode,
          provider_id: "",
          project_id: "",
          tokens_used: 0,
          message_count: 0,
        };

        const { error } = await supabase
          .from("chat_sessions")
          .insert(newSession);

        if (error) throw error;

        // Update the local state
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(sessionId);

        toast.success("New session created");
        logger.info("Session created", { sessionId });

        return sessionId;
      } catch (error) {
        handleError(error, "Failed to create session");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const switchSession = useCallback(
    (sessionId: string) => {
      if (sessions.some((s) => s.id === sessionId)) {
        setCurrentSessionId(sessionId);

        // Update the last_accessed timestamp in the database
        supabase
          .from("chat_sessions")
          .update({ last_accessed: new Date().toISOString() })
          .eq("id", sessionId)
          .then(() => {
            logger.info("Session switched", { sessionId });
          })
          .catch((error) => {
            logger.error("Failed to update session last_accessed", {
              error,
              sessionId,
            });
          });

        return true;
      }
      return false;
    },
    [sessions]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const { error } = await supabase
          .from("chat_sessions")
          .delete()
          .eq("id", sessionId);

        if (error) throw error;

        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        // If we deleted the current session, switch to the first available one
        if (currentSessionId === sessionId) {
          const remainingSessions = sessions.filter((s) => s.id !== sessionId);
          if (remainingSessions.length > 0) {
            setCurrentSessionId(remainingSessions[0].id);
          } else {
            setCurrentSessionId(null);
          }
        }

        toast.success("Session deleted");
        logger.info("Session deleted", { sessionId });

        return true;
      } catch (error) {
        handleError(error, "Failed to delete session");
        return false;
      }
    },
    [currentSessionId, sessions]
  );

  const clearSessions = useCallback(
    async (preserveCurrent: boolean = true) => {
      try {
        if (sessions.length === 0) return true;

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error("User not authenticated");

        let query = supabase
          .from("chat_sessions")
          .delete()
          .eq("user_id", user.id);

        // If preserveCurrent is true and we have a current session, exclude it
        if (preserveCurrent && currentSessionId) {
          query = query.neq("id", currentSessionId);
        }

        const { error } = await query;
        if (error) throw error;

        if (preserveCurrent && currentSessionId) {
          setSessions((prev) => prev.filter((s) => s.id === currentSessionId));
        } else {
          setSessions([]);
          setCurrentSessionId(null);
        }

        toast.success(
          preserveCurrent ? "Other sessions cleared" : "All sessions cleared"
        );
        logger.info("Sessions cleared", { preserveCurrent });

        return true;
      } catch (error) {
        handleError(error, "Failed to clear sessions");
        return false;
      }
    },
    [currentSessionId, sessions]
  );

  const cleanupInactiveSessions = useCallback(async () => {
    try {
      // Get sessions older than 30 days that are not the current session
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("user_id", user.id)
        .lt("last_accessed", thirtyDaysAgo.toISOString())
        .neq("id", currentSessionId || "")
        .select();

      if (error) throw error;

      const deletedCount = data?.length || 0;

      if (deletedCount > 0) {
        // Update local state to remove deleted sessions
        setSessions((prev) =>
          prev.filter((s) => {
            const lastAccessed = new Date(
              s.last_accessed || s.created_at || Date.now()
            );
            return s.id === currentSessionId || lastAccessed >= thirtyDaysAgo;
          })
        );

        toast.success(
          `Cleaned up ${deletedCount} inactive session${
            deletedCount === 1 ? "" : "s"
          }`
        );
        logger.info("Inactive sessions cleaned up", { count: deletedCount });
      }

      return deletedCount;
    } catch (error) {
      handleError(error, "Failed to cleanup inactive sessions");
      return 0;
    }
  }, [currentSessionId]);

  // Load sessions on mount
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  return {
    sessions,
    currentSessionId,
    isLoading,
    refreshSessions,
    createSession,
    switchSession,
    deleteSession,
    clearSessions,
    cleanupInactiveSessions,
  };
}
