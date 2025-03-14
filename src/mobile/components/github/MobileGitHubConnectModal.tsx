
import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Github, 
  ExternalLink, 
  Check, 
  AlertCircle,
  ArrowRightIcon,
  Loader2
} from "lucide-react";
import { GitHubConnectionStatusProps } from "@/types/admin/settings/github";

interface MobileGitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  isChecking: boolean;
  connectionStatus: GitHubConnectionStatusProps;
  githubUsername: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const MobileGitHubConnectModal = ({
  isOpen,
  onClose,
  isConnected,
  isChecking,
  connectionStatus,
  githubUsername,
  onConnect,
  onDisconnect
}: MobileGitHubConnectModalProps) => {
  const handleConnect = () => {
    onConnect();
    toast.info("Connecting to GitHub...");
  };

  const handleDisconnect = () => {
    onDisconnect();
    toast.success("Disconnected from GitHub");
    onClose();
  };

  const isLoading = isChecking || connectionStatus.status === 'connecting';
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="mobile-glass h-[80vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 text-neon-blue">
            <Github className="h-5 w-5" />
            GitHub Integration
          </SheetTitle>
          <SheetDescription>
            Connect your GitHub account to enable repository creation and synchronization
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-green-500">Connected</div>
                    <div className="text-sm text-muted-foreground">
                      Signed in as @{githubUsername}
                    </div>
                  </div>
                </div>
                
                <a 
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neon-blue flex items-center gap-1"
                >
                  View Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">GitHub Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    Create repositories for your projects
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    Sync code changes automatically
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-green-500" />
                    Import existing repositories
                  </li>
                </ul>
              </div>
              
              <Button 
                variant="destructive" 
                className="w-full mt-4"
                onClick={handleDisconnect}
              >
                Disconnect from GitHub
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {connectionStatus.status === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-500">Connection Error</div>
                    <div className="text-sm text-muted-foreground">
                      {connectionStatus.errorMessage || "Failed to connect to GitHub. Please try again."}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-medium">Why connect to GitHub?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRightIcon className="h-4 w-4 text-neon-pink" />
                    Create repositories directly from the app
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRightIcon className="h-4 w-4 text-neon-pink" />
                    Sync code changes automatically
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRightIcon className="h-4 w-4 text-neon-pink" />
                    Import existing repositories
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Connect with GitHub
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        <SheetFooter className="flex-col">
          <div className="flex items-center justify-center w-full text-xs text-muted-foreground gap-1">
            <Github className="h-3 w-3" />
            GitHub API v3
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
