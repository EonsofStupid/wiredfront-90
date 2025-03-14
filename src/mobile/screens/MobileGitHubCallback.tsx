import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Github, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MobileGitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState<string>("Processing GitHub authentication...");
  
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
        
        if (exchangeError) throw exchangeError;
        
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
          } else {
            // Otherwise, redirect to home page
            navigate("/");
          }
        }, 3000);
      } catch (error) {
        console.error("GitHub callback error:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to complete GitHub authentication");
      }
    };
    
    handleCallback();
  }, [searchParams, navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="mobile-glass-card w-full max-w-md">
        <div className="flex flex-col items-center space-y-4 text-center">
          {status === "processing" && (
            <>
              <Loader2 className="h-12 w-12 text-neon-blue animate-spin" />
              <h2 className="text-xl font-medium">Connecting to GitHub</h2>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="relative">
                <Github className="h-12 w-12 text-neon-blue" />
                <CheckCircle2 className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1" />
              </div>
              <h2 className="text-xl font-medium">Successfully Connected</h2>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="relative">
                <Github className="h-12 w-12 text-neon-pink" />
                <AlertCircle className="h-6 w-6 text-red-500 absolute -bottom-1 -right-1" />
              </div>
              <h2 className="text-xl font-medium text-red-500">Connection Failed</h2>
            </>
          )}
          
          <p className="text-sm text-muted-foreground">{message}</p>
          
          {status === "error" && (
            <div className="pt-4 flex flex-col w-full gap-2">
              <Button onClick={() => navigate("/")} variant="outline">
                Return Home
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
