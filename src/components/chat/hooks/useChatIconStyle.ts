
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from "@/stores/session/store";
import { atom, useAtom } from "jotai";

// Define a type for the icon style options
export type ChatIconStyle = "default" | "wfpulse" | "retro" | "basic";

// Create a Jotai atom for the chat icon style with "wfpulse" as default
export const chatIconStyleAtom = atom<ChatIconStyle>("wfpulse");

export const useChatIconStyle = () => {
  const { user } = useSessionStore();
  const [iconStyle, setIconStyle] = useAtom(chatIconStyleAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's chat icon style preference from the database
  useEffect(() => {
    const fetchIconStyle = async () => {
      if (!user?.id) {
        // If no user, default to wfpulse
        setIconStyle("wfpulse");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("user_chat_preferences")
          .select("icon_style")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data?.icon_style) {
          console.log("Loaded chat icon style from database:", data.icon_style);
          setIconStyle(data.icon_style as ChatIconStyle);
        } else {
          // If no preference is found, create a default one using wfpulse
          console.log("No chat icon style found, creating wfpulse default");
          await createDefaultPreference(user.id);
          setIconStyle("wfpulse");
        }
      } catch (err) {
        console.error("Error fetching chat icon style:", err);
        setError("Failed to load chat icon style");
        // Still set a default
        setIconStyle("wfpulse");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIconStyle();
  }, [user?.id, setIconStyle]);

  // Create a default chat icon style preference with wfpulse
  const createDefaultPreference = async (userId: string) => {
    try {
      await supabase.from("user_chat_preferences").insert({
        user_id: userId,
        icon_style: "wfpulse",
      });
    } catch (err) {
      console.error("Error creating default chat icon style:", err);
    }
  };

  // Update the user's chat icon style preference
  const updateIconStyle = async (style: ChatIconStyle) => {
    if (!user?.id) {
      // If no user, just update the local state
      setIconStyle(style);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("user_chat_preferences")
        .upsert({
          user_id: user.id,
          icon_style: style,
        });

      if (error) throw error;

      setIconStyle(style);
      console.log("Updated chat icon style:", style);
    } catch (err) {
      console.error("Error updating chat icon style:", err);
      setError("Failed to update chat icon style");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    iconStyle: iconStyle || "wfpulse", // Always provide a default
    setIconStyle: updateIconStyle,
    isLoading,
    error,
  };
};
