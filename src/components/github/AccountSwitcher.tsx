
import React, { useState } from "react";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, User, Plus, Check, Loader2, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AccountSwitcher() {
  const {
    isConnected,
    isChecking,
    linkedAccounts,
    githubUsername,
    connectGitHub,
    disconnectGitHub,
    setDefaultGitHubAccount
  } = useGitHubConnection();
  
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnectAccount = () => {
    connectGitHub();
  };

  const handleSetDefaultAccount = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account to set as default");
      return;
    }
    
    setIsSettingDefault(true);
    try {
      await setDefaultGitHubAccount(selectedAccount);
      toast.success("Default GitHub account updated");
    } catch (error) {
      console.error("Error setting default account:", error);
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleDisconnectAccount = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account to disconnect");
      return;
    }
    
    setIsDisconnecting(true);
    try {
      await disconnectGitHub(selectedAccount);
      setSelectedAccount(null);
      toast.success("GitHub account disconnected");
    } catch (error) {
      console.error("Error disconnecting account:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Accounts</CardTitle>
          <CardDescription>Connect and manage your GitHub accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <Github className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Not Connected to GitHub</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your GitHub account to get started
              </p>
              <Button onClick={handleConnectAccount} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking Connection...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Connect to GitHub
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (linkedAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GitHub Accounts</CardTitle>
          <CardDescription>Connect and manage your GitHub accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">No Linked Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're connected to GitHub but don't have any linked accounts.
              </p>
              <Button onClick={handleConnectAccount}>
                <Plus className="h-4 w-4 mr-2" />
                Add GitHub Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const defaultAccount = linkedAccounts.find(account => account.default);

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub Accounts</CardTitle>
        <CardDescription>Manage your connected GitHub accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Default Account</p>
                <p className="text-sm text-muted-foreground">
                  Used for all GitHub operations
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-neon-blue" />
              <span className="font-medium">
                {defaultAccount ? `@${defaultAccount.username}` : "None set"}
              </span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Account
            </label>
            <Select 
              value={selectedAccount || ""} 
              onValueChange={setSelectedAccount}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a GitHub account" />
              </SelectTrigger>
              <SelectContent>
                {linkedAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Github className="h-4 w-4" />
                        @{account.username}
                      </div>
                      {account.default && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="default" 
              onClick={handleSetDefaultAccount}
              disabled={!selectedAccount || isSettingDefault}
              className="sm:flex-1"
            >
              {isSettingDefault ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting Default...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Set as Default
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleDisconnectAccount}
              disabled={!selectedAccount || isDisconnecting}
              className="sm:flex-1"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect Account"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleConnectAccount}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Account
        </Button>
      </CardFooter>
    </Card>
  );
}
