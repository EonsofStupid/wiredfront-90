
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useGitHubTokenValidation(onTokenAdded: () => void, onClose: () => void) {
  const [tokenName, setTokenName] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationState, setValidationState] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState("");

  const validateToken = async (token: string) => {
    if (!token.trim()) {
      setError("Please enter a valid GitHub token");
      return false;
    }

    try {
      setIsLoading(true);
      setError("");
      setValidationState("validating");
      
      const validateResult = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'validate', 
          tokenData: { token }
        },
      });
      
      if (validateResult.error) {
        setValidationState("invalid");
        setError(validateResult.error.message || "Invalid GitHub token");
        return false;
      }
      
      setValidationState("valid");
      setValidationResult(validateResult.data);
      return true;
    } catch (error: any) {
      setValidationState("invalid");
      setError(error.message || "Error validating token");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenName.trim()) {
      setError("Please enter a token name");
      return;
    }
    
    if (!token.trim()) {
      setError("Please enter a valid GitHub token");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // If token hasn't been validated yet, validate it first
      let isValid = validationState === "valid";
      
      if (!isValid) {
        isValid = await validateToken(token);
        if (!isValid) return; // Stop if validation failed
      }
      
      // At this point we know the token is valid and we have validation results
      // Save token
      const saveResult = await supabase.functions.invoke('github-token-management', {
        body: { 
          action: 'save', 
          tokenData: { 
            name: tokenName,
            token,
            github_username: validationResult.user.login,
            scopes: ["repo", "read:user"],
            rate_limit: validationResult.rate_limit
          }
        },
      });
      
      if (saveResult.error) {
        throw new Error(saveResult.error.message || "Failed to save GitHub token");
      }
      
      toast.success("GitHub token added successfully");
      resetForm();
      onTokenAdded();
    } catch (error: any) {
      console.error("Error adding GitHub token:", error);
      toast.error(error.message || "Failed to add GitHub token");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTokenName("");
    setToken("");
    setValidationState("idle");
    setValidationResult(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    tokenName,
    setTokenName,
    token,
    setToken,
    isLoading,
    validationState,
    validationResult,
    error,
    handleSubmit,
    validateToken,
    handleClose
  };
}
