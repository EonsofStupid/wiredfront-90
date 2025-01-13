import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { toast } from "sonner";

const LazyDraggableChat = React.lazy(() => 
  import("@/components/chat/DraggableChat").catch(error => {
    console.error("Failed to load DraggableChat:", error);
    toast.error("Failed to load chat interface");
    throw error;
  })
);

const LoadingSpinner = () => (
  <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-background/80 backdrop-blur">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

export default function Index() {
  console.log("Index component rendering");
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const { user, loading } = useAuthStore();

  console.log("Auth state:", { user, loading, showSetup, isFirstTimeUser, isLoadingAPI });

  const loadAPIConfigurations = useCallback(async () => {
    console.log("Loading API configurations");
    if (!user) {
      console.log("No user, skipping API config load");
      setIsLoadingAPI(false);
      return;
    }

    setIsLoadingAPI(true);
    try {
      const { data: apiConfigs, error: configError } = await supabase
        .from('api_configurations')
        .select('id, is_enabled')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .limit(1)
        .single();

      console.log("API configs loaded:", { apiConfigs, error: configError });

      if (configError) throw configError;

      if (!apiConfigs) {
        console.log("No API configs found, showing setup");
        setIsFirstTimeUser(true);
        setShowSetup(true);
      }
    } catch (err) {
      console.error('Error loading API configurations:', err);
      toast.error('Failed to load API configurations');
    } finally {
      setIsLoadingAPI(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("Index useEffect running");
    let mounted = true;

    const initializeUser = async () => {
      if (user && mounted) {
        console.log("Initializing user");
        await loadAPIConfigurations();
      }
    };

    initializeUser();

    let subscription;
    if (user) {
      console.log("Setting up real-time subscription");
      const channel = supabase.channel('api_config_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'api_configurations',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log("Real-time update received");
          if (mounted) {
            loadAPIConfigurations();
          }
        })
        .subscribe();

      subscription = () => {
        console.log("Cleaning up subscription");
        supabase.removeChannel(channel);
      };
    }

    return () => {
      console.log("Index component cleanup");
      mounted = false;
      if (subscription) {
        subscription();
      }
    };
  }, [user, loadAPIConfigurations]);

  if (loading) {
    console.log("Showing loading spinner");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  console.log("Rendering main content, user:", user);

  if (!user) {
    console.log("Rendering public landing page");
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
          <main className="container mx-auto max-w-6xl">
            <HeroSection />
            <FeaturesSection />
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen">
        {showSetup && (
          <SetupWizard 
            isFirstTimeUser={isFirstTimeUser}
            onComplete={() => {
              console.log("Setup completed");
              setShowSetup(false);
              toast.success("Setup completed successfully!");
              navigate('/dashboard', { replace: true });
            }} 
          />
        )}
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>
            <LazyDraggableChat />
          </ErrorBoundary>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}