import { DraggableChat } from "@/components/chat/DraggableChat";
import { CacheMetricsPanel } from "@/components/debug/CacheMetricsPanel";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, Code, FileText, Settings } from "lucide-react";

export default function Index() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const navigationItems = [
    {
      icon: Code,
      label: "Editor",
      path: "/editor",
      description: "Create and edit your projects"
    },
    {
      icon: FileText,
      label: "Documents",
      path: "/documents",
      description: "Manage your documents"
    },
    {
      icon: Bot,
      label: "AI Assistant",
      path: "/ai",
      description: "Get help from our AI"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      description: "Configure your preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold gradient-text">Welcome to wiredFRONT</h1>
            <p className="text-muted-foreground">
              Your intelligent development companion
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-8 w-8 text-neon-pink" />
                <div className="text-center">
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Button>
            ))}
          </div>

          {!user && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Get started by logging in or creating an account
              </p>
              <Button onClick={() => navigate('/login')}>
                Login / Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      <SetupWizard />
      <DraggableChat />
      {process.env.NODE_ENV === 'development' && <CacheMetricsPanel />}
    </div>
  );
}