
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from "@/stores/session/store";
import { atom, useAtom } from "jotai";

// Define a type for the icon style options
export type ChatIconStyle = "default" | "wfpulse" | "retro" | "basic";

// Create a Jotai atom for the chat icon style
export const chatIconStyleAtom = atom<ChatIconStyle>("default");

export const useChatIconStyle = () => {
  const { user } = useSessionStore();
  const [iconStyle, setIconStyle] = useAtom(chatIconStyleAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user's chat icon style preference from the database
  useEffect(() => {
    const fetchIconStyle = async () => {
      if (!user?.id) return;

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
          // If no preference is found, create a default one
          console.log("No chat icon style found, creating default");
          await createDefaultPreference(user.id);
        }
      } catch (err) {
        console.error("Error fetching chat icon style:", err);
        setError("Failed to load chat icon style");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIconStyle();
  }, [user?.id, setIconStyle]);

  // Create a default chat icon style preference
  const createDefaultPreference = async (userId: string) => {
    try {
      await supabase.from("user_chat_preferences").insert({
        user_id: userId,
        icon_style: "default",
      });
    } catch (err) {
      console.error("Error creating default chat icon style:", err);
    }
  };

  // Update the user's chat icon style preference
  const updateIconStyle = async (style: ChatIconStyle) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("user_chat_preferences")
        .upsert({
          user_id: user.id,
          icon_style: style,
        })
        .select();

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
    iconStyle,
    setIconStyle: updateIconStyle,
    isLoading,
    error,
  };
};
