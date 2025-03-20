import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
export function useGitHubToken() {
    const [isSaving, setIsSaving] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [githubUsername, setGithubUsername] = useState(null);
    const validateGithubToken = async (token) => {
        if (!token) {
            toast.error("Please enter a GitHub token");
            return;
        }
        setIsValidating(true);
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setIsValid(true);
                setGithubUsername(userData.login);
                // Get rate limit info
                const rateLimitResponse = await fetch('https://api.github.com/rate_limit', {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (rateLimitResponse.ok) {
                    const rateLimitData = await rateLimitResponse.json();
                    const resetDate = new Date(rateLimitData.resources.core.reset * 1000);
                    setMetrics({
                        remaining: rateLimitData.resources.core.remaining,
                        limit: rateLimitData.resources.core.limit,
                        resetTime: resetDate.toLocaleTimeString(),
                        lastChecked: new Date().toLocaleTimeString()
                    });
                }
                toast.success("GitHub token is valid");
            }
            else {
                setIsValid(false);
                toast.error("Invalid GitHub token");
            }
        }
        catch (error) {
            console.error("Error validating GitHub token:", error);
            setIsValid(false);
            toast.error("Failed to validate GitHub token");
        }
        finally {
            setIsValidating(false);
        }
    };
    const saveGithubToken = async (newGithubToken, onGithubTokenChange) => {
        if (!newGithubToken) {
            toast.error("Please enter a GitHub token");
            return;
        }
        setIsSaving(true);
        try {
            const { data, error } = await supabase.functions.invoke('manage-api-secret', {
                body: {
                    action: 'create',
                    provider: 'github',
                    memorableName: 'primary_github_token',
                    secretValue: newGithubToken,
                    settings: {
                        feature_bindings: ['code_generation', 'repository_access', 'github_sync']
                    }
                }
            });
            if (error)
                throw error;
            toast.success("GitHub token saved successfully");
            onGithubTokenChange(newGithubToken);
        }
        catch (error) {
            console.error("Error saving GitHub token:", error);
            toast.error("Failed to save GitHub token");
        }
        finally {
            setIsSaving(false);
        }
    };
    const syncGithubMetrics = async () => {
        setIsValidating(true);
        try {
            const { data, error } = await supabase.functions.invoke('manage-api-secret', {
                body: {
                    action: 'sync_github_metrics'
                }
            });
            if (error)
                throw error;
            toast.success("GitHub metrics synced successfully");
            // Update local state based on response
            if (data?.results && data.results.length > 0) {
                const result = data.results.find((r) => r.status === 'synced');
                if (result) {
                    setMetrics({
                        remaining: result.metrics.remaining,
                        limit: result.metrics.limit,
                        resetTime: new Date(result.metrics.reset).toLocaleTimeString(),
                        lastChecked: new Date().toLocaleTimeString()
                    });
                }
            }
        }
        catch (error) {
            console.error("Error syncing GitHub metrics:", error);
            toast.error("Failed to sync GitHub metrics");
        }
        finally {
            setIsValidating(false);
        }
    };
    return {
        isSaving,
        isValidating,
        isValid,
        metrics,
        githubUsername,
        validateGithubToken,
        saveGithubToken,
        syncGithubMetrics,
        setGithubUsername
    };
}
