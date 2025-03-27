import React, { useState } from "react";
import { Menu, Search, Bell, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "../hooks/useMobileMenu";
import { MobilePageTitle } from "./MobilePageTitle";
import { useGitHubConnection } from '@/components/features/github/hooks/useGitHubConnection';
import { MobileGitHubConnectModal } from "../components/github/MobileGitHubConnectModal";

/**
 * Mobile header component with menu button, page title and GitHub integration
 */
export const MobileHeader = () => {
  const { toggleMenu } = useMobileMenu();
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const { 
    isConnected, 
    isChecking, 
    connectionStatus, 
    githubUsername,
    connectGitHub, 
    disconnectGitHub 
  } = useGitHubConnection();
  
  return (
    <header className="mobile-header">
      <div className="flex items-center justify-between px-4 h-full">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-neon-pink hover:text-neon-blue"
          onClick={toggleMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <MobilePageTitle />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={`relative ${isConnected ? 'text-green-500 hover:text-green-400' : 'text-neon-pink hover:text-neon-blue'}`}
            onClick={() => setIsGitHubModalOpen(true)}
          >
            <Github className="h-5 w-5" />
            {isConnected && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-neon-pink hover:text-neon-blue"
          >
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <MobileGitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        isConnected={isConnected}
        isChecking={isChecking}
        connectionStatus={connectionStatus}
        githubUsername={githubUsername}
        onConnect={connectGitHub}
        onDisconnect={disconnectGitHub}
      />
    </header>
  );
};
