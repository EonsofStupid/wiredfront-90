import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!loading && user) {
        // Check if user has completed setup
        const { data: profile } = await supabase
          .from('profiles')
          .select('setup_completed_at, onboarding_status')
          .eq('id', user.id)
          .single();

        if (!profile?.setup_completed_at) {
          setIsFirstTimeUser(true);
          setShowSetup(true);
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    checkUserSetup();
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Guest mode view
  if (!user && !loading) {
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
            navigate('/dashboard', { replace: true });
          }} 
        />
      )}
      <DraggableChat />
    </div>
  );
}