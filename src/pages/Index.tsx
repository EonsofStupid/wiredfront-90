import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthenticatedSession } from "@/hooks/useAuthenticatedSession";
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export default function Index() {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [isLoadingAPI, setIsLoadingAPI] = useState(true);
  const { isLoading, error, user } = useAuthenticatedSession();

  // Memoize the API configuration loading function
  const loadAPIConfigurations = useCallback(async () => {
    if (!user) return;

    try {
      const { data: apiConfigs, error: configError } = await supabase
        .from('api_configurations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_enabled', true)
        .limit(1); // Limit to only what we need

      if (configError) throw configError;

      if (!apiConfigs?.length) {
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
    }

    return () => {
      mounted = false;
    };
  }, [user, loadAPIConfigurations]);

  // Show error state if something went wrong
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

  // Show loading state while checking auth and loading configurations
  if (isLoading || isLoadingAPI) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Guest mode view
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 px-4">
        <div className="container mx-auto max-w-6xl py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">wiredFRONT</span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Experience AI-powered development assistance
          </p>
          
          <div className="mt-12 space-y-8">
            {/* Guest Chat Preview */}
            <div className="relative">
              <DraggableChat />
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => navigate('/login')}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Login to Unlock Full Features
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get personalized assistance, save your sessions, and more!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">AI-Powered Assistance</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Get intelligent code suggestions and real-time help
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">Personalized Experience</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Customize your workspace and save your preferences
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">Seamless Integration</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with your favorite AI providers and tools
                </p>
              </div>
            </div>
          </div>
        </div>
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
            const userRole = user?.app_metadata?.role || 'user';
            navigate(userRole === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
          }} 
        />
      )}
      <DraggableChat />
    </div>
  );
}