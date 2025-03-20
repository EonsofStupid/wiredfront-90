import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Github, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
export const MobileGitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing");
    const [message, setMessage] = useState("Processing GitHub authentication...");
    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");
            const error = searchParams.get("error");
            if (error) {
                setStatus("error");
                setMessage(error === "access_denied"
                    ? "You denied access to your GitHub account."
                    : `GitHub authentication error: ${error}`);
                return;
            }
            if (!code || !state) {
                setStatus("error");
                setMessage("Missing required parameters");
                return;
            }
            try {
                // Call the edge function to exchange the code for an access token
                const { data, error: exchangeError } = await supabase.functions.invoke("github-oauth-callback", {
                    body: {
                        code,
                        state
                    }
                });
                if (exchangeError)
                    throw exchangeError;
                if (!data.success) {
                    throw new Error(data.message || "Failed to authenticate with GitHub");
                }
                setStatus("success");
                setMessage(`Connected to GitHub as @${data.username}`);
                // Close this window after a short delay
                setTimeout(() => {
                    // First check if this is a popup window
                    if (window.opener && !window.opener.closed) {
                        window.close();
                    }
                    else {
                        // Otherwise, redirect to home page
                        navigate("/");
                    }
                }, 3000);
            }
            catch (error) {
                console.error("GitHub callback error:", error);
                setStatus("error");
                setMessage(error instanceof Error ? error.message : "Failed to complete GitHub authentication");
            }
        };
        handleCallback();
    }, [searchParams, navigate]);
    return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-[70vh] p-4", children: _jsx("div", { className: "mobile-glass-card w-full max-w-md", children: _jsxs("div", { className: "flex flex-col items-center space-y-4 text-center", children: [status === "processing" && (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-12 w-12 text-neon-blue animate-spin" }), _jsx("h2", { className: "text-xl font-medium", children: "Connecting to GitHub" })] })), status === "success" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx(Github, { className: "h-12 w-12 text-neon-blue" }), _jsx(CheckCircle2, { className: "h-6 w-6 text-green-500 absolute -bottom-1 -right-1" })] }), _jsx("h2", { className: "text-xl font-medium", children: "Successfully Connected" })] })), status === "error" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx(Github, { className: "h-12 w-12 text-neon-pink" }), _jsx(AlertCircle, { className: "h-6 w-6 text-red-500 absolute -bottom-1 -right-1" })] }), _jsx("h2", { className: "text-xl font-medium text-red-500", children: "Connection Failed" })] })), _jsx("p", { className: "text-sm text-muted-foreground", children: message }), status === "error" && (_jsxs("div", { className: "pt-4 flex flex-col w-full gap-2", children: [_jsx(Button, { onClick: () => navigate("/"), variant: "outline", children: "Return Home" }), _jsx(Button, { onClick: () => window.location.reload(), children: "Try Again" })] }))] }) }) }));
};
