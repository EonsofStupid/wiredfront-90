import { useEffect, useState, useCallback, Suspense } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

const LazyDraggableChat = React.lazy(() => import("@/components/chat/DraggableChat"));

export default function Index() {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(true);
  const { user, loading, error } = useAuthStore();

  const loadAPIConfigurations = useCallback(async () => {
    if (!user) {
      setIsLoadingAPI(false);
      return;
    }

    try {
      const { data: apiConfigs, error: configError } = await supabase
        .from('api_configurations')
        .select('id, is_enabled')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .limit(1)
        .single();

      if (configError) throw configError;

      if (!apiConfigs) {
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
    let mounted = true;

    if (user && mounted) {
      loadAPIConfigurations();
    } else {
      setIsLoadingAPI(false);
    }

    return () => {
      mounted = false;
    };
  }, [user, loadAPIConfigurations]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-destructive mb-4">Error loading application</div>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (loading || isLoadingAPI) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <main className="container mx-auto max-w-6xl">
          <HeroSection />
          <FeaturesSection />
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {showSetup && (
        <SetupWizard 
          isFirstTimeUser={isFirstTimeUser}
          onComplete={() => {
            setShowSetup(false);
            toast.success("Setup completed successfully!");
            navigate('/dashboard', { replace: true });
          }} 
        />
      )}
      <Suspense fallback={
        <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-background/80 backdrop-blur">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      }>
        <LazyDraggableChat />
      </Suspense>
    </div>
  );
}