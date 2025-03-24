import { supabase } from "@/integrations/supabase/client";
import { useSessionStore } from "@/stores/session/store";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const useTokenManagement = () => {
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [enforcementMode, setEnforcementMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSessionStore();

  // Fetch initial token balance and enforcement mode on mount
  useEffect(() => {
    if (user?.id) {
      fetchUserTokens(user.id);
    }
  }, [user?.id]);

  const fetchUserTokens = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      setTokenBalance(data?.balance || 0);
      setEnforcementMode(data?.enforcement_mode || "never");
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      setError("Failed to fetch user tokens");
      setTokenBalance(null);
      setEnforcementMode(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTokens = useCallback(
    async (userId: string, amount: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.rpc("add_tokens", {
          user_uuid: userId,
          token_amount: amount,
        });

        if (error) throw error;

        // Optimistically update the local state
        setTokenBalance((prevBalance) =>
          prevBalance !== null ? prevBalance + amount : amount
        );

        toast.success(`Successfully added ${amount} tokens`);
        await fetchUserTokens(userId); // Refresh tokens
        return data;
      } catch (error) {
        console.error("Error adding tokens:", error);
        setError("Failed to add tokens");
        toast.error("Failed to add tokens");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserTokens]
  );

  const spendTokens = useCallback(
    async (userId: string, amount: number) => {
      setIsLoading(true);
      setError(null);

      try {
        // Call the spend_tokens function
        const { data, error } = await supabase.rpc("spend_tokens", {
          user_uuid: userId,
          token_amount: amount,
        });

        if (error) throw error;

        // Optimistically update the local state
        setTokenBalance((prevBalance) =>
          prevBalance !== null ? prevBalance - amount : 0
        );

        toast.success(`Successfully spent ${amount} tokens`);
        await fetchUserTokens(userId); // Refresh tokens
        return data;
      } catch (error) {
        console.error("Error spending tokens:", error);
        setError("Failed to spend tokens");
        toast.error("Failed to spend tokens");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserTokens]
  );

  const setTokenEnforcementMode = useCallback(
    async (userId: string, mode: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("user_tokens")
          .update({ enforcement_mode: mode })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        setEnforcementMode(mode);
        toast.success(`Token enforcement mode updated to ${mode}`);
        await fetchUserTokens(userId); // Refresh tokens
        return data;
      } catch (error) {
        console.error("Error updating token enforcement mode:", error);
        setError("Failed to update token enforcement mode");
        toast.error("Failed to update token enforcement mode");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserTokens]
  );

  const setTokenBalanceForUser = useCallback(
    async (userId: string, balance: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("user_tokens")
          .update({ balance: balance })
          .eq("user_id", userId)
          .select()
          .single();

        if (error) throw error;

        setTokenBalance(balance);
        toast.success(`Token balance updated to ${balance}`);
        await fetchUserTokens(userId); // Refresh tokens
        return data;
      } catch (error) {
        console.error("Error updating token balance:", error);
        setError("Failed to update token balance");
        toast.error("Failed to update token balance");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserTokens]
  );

  const checkAndSetupUserTokens = async (userId: string) => {
    try {
      // Check if the user already has token balance
      const { data: existingTokens, error: fetchError } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Fix the truthiness check - don't test 'void' expression
      if (existingTokens) {
        return existingTokens;
      }

      // If no tokens exist, create a new record
      const { data: newTokens, error: insertError } = await supabase
        .from("user_tokens")
        .insert([
          {
            user_id: userId,
            balance: 10, // Initial free tokens
            total_earned: 10,
            last_reset: new Date().toISOString(),
            enforcement_mode: "never",
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      return newTokens;
    } catch (error) {
      console.error("Error checking/setting up user tokens:", error);
      return null;
    }
  };

  // Add isTokenEnforcementEnabled computed property
  const isTokenEnforcementEnabled = enforcementMode !== "never";

  return {
    tokenBalance,
    enforcementMode,
    isTokenEnforcementEnabled,
    isLoading,
    error,
    addTokens,
    spendTokens,
    setTokenEnforcementMode,
    setTokenBalance: setTokenBalanceForUser,
    fetchUserTokens,
    checkAndSetupUserTokens,
  };
};
