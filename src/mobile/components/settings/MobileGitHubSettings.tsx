import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGitHubConnection } from '@/components/features/github/hooks/useGitHubConnection';
import { Loader2, Github, Plus, ExternalLink, Check, AlertCircle, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const MobileGitHubSettings = () => {
  const { 
    isConnected,
    isChecking,
    connectionStatus,
    githubUsername,
    linkedAccounts,
    connectGitHub,
    disconnectGitHub,
    setDefaultGitHubAccount
  } = useGitHubConnection();
  
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("accounts");
  
  const handleConnect = () => {
    connectGitHub();
  };
  
  const handleDisconnect = (accountId?: string) => {
    if (accountId) {
      disconnectGitHub(accountId);
    } else {
      disconnectGitHub();
    }
  };
  
  const handleSetDefaultAccount = (accountId: string) => {
    setDefaultGitHubAccount(accountId);
    toast.success("Default GitHub account updated");
  };
  
  const toggleAccountExpanded = (accountId: string) => {
    if (expandedAccount === accountId) {
      setExpandedAccount(null);
    } else {
      setExpandedAccount(accountId);
    }
  };
  
  const renderConnectionStatus = () => {
    if (isChecking) {
      return (
        <div className="flex items-center text-sm">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Checking connection...
        </div>
      );
    }
    
    if (connectionStatus.status === 'error') {
      return (
        <div className="flex items-start gap-2 mt-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <div className="text-sm text-red-500">
            {connectionStatus.errorMessage || "Connection error"}
          </div>
        </div>
      );
    }
    
    if (isConnected && connectionStatus.lastCheck) {
      const lastCheck = new Date(connectionStatus.lastCheck);
      return (
        <div className="text-xs text-muted-foreground mt-1">
          Last checked {formatDistanceToNow(lastCheck, { addSuffix: true })}
        </div>
      );
    }
    
    return null;
  };
  
  if (!isConnected) {
    return (
      <div className="space-y-4 p-4">
        <div className="p-4 rounded-lg bg-dark-lighter/30 flex flex-col items-center justify-center space-y-3">
          <Github className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-medium">Not Connected</h3>
            <p className="text-sm text-muted-foreground">
              Connect to GitHub to enable repository creation and code synchronization
            </p>
          </div>
          
          {renderConnectionStatus()}
          
          <Button
            className="w-full mt-2"
            onClick={handleConnect}
            disabled={isChecking || connectionStatus.status === 'connecting'}
          >
            {isChecking || connectionStatus.status === 'connecting' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Github className="h-4 w-4 mr-2" />
                Connect to GitHub
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="font-medium">GitHub integration enables:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Creating and managing repositories</li>
            <li>Syncing code changes</li>
            <li>Connecting multiple GitHub accounts</li>
            <li>Importing existing projects</li>
          </ul>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <Tabs defaultValue="accounts" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="repos">Repositories</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          {/* Default Account Section */}
          <div className="bg-dark-lighter/20 border border-neon-blue/20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Default Account</span>
              {linkedAccounts.find(a => a.default) ? (
                <Badge className="bg-green-500/20 text-green-500 font-normal">
                  @{linkedAccounts.find(a => a.default)?.username}
                </Badge>
              ) : (
                <Badge variant="outline" className="font-normal">None set</Badge>
              )}
            </div>
          </div>
          
          {/* Linked Accounts */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Linked Accounts</h3>
            
            {linkedAccounts.map((account) => (
              <div 
                key={account.id}
                className="border border-neon-blue/20 rounded-lg overflow-hidden bg-dark-lighter/20"
              >
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-dark-lighter/30 transition-colors"
                  onClick={() => toggleAccountExpanded(account.id)}
                >
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-neon-blue" />
                    <span className="font-medium">@{account.username}</span>
                    {account.default && (
                      <Badge className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-500">
                        Default
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                
                {expandedAccount === account.id && (
                  <div className="p-3 border-t border-neon-blue/10 space-y-3 animate-in fade-in-50 duration-200">
                    <div className="flex justify-between items-center">
                      <a
                        href={`https://github.com/${account.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 text-neon-blue"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      
                      {!account.default && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs h-7 text-green-500 border-green-500/30 hover:bg-green-500/10"
                          onClick={() => handleSetDefaultAccount(account.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Set as Default
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleDisconnect(account.id)}
                    >
                      Disconnect This Account
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleConnect}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Another Account
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="repos">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-dark-lighter/20 border border-neon-blue/10 flex flex-col items-center justify-center">
              <h3 className="font-medium">Repository Management</h3>
              <p className="text-sm text-muted-foreground text-center mt-1 mb-3">
                Go to the full GitHub settings page to manage your repositories
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/settings'}
              >
                Open Full Settings
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sync">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-dark-lighter/20 border border-neon-blue/10 flex flex-col items-center justify-center">
              <h3 className="font-medium">Sync Status Dashboard</h3>
              <p className="text-sm text-muted-foreground text-center mt-1 mb-3">
                Go to the full GitHub settings page to view your sync history
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/settings'}
              >
                Open Full Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
