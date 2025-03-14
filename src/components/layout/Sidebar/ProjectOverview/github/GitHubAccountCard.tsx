
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Plus, LogOut, User, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";

interface GitHubAccountCardProps {
  username: string | null;
  accounts: Array<{
    id: string;
    username: string;
    default: boolean;
  }>;
  onAddAccount: () => void;
  onDisconnect: () => void;
}

export function GitHubAccountCard({ 
  username, 
  accounts, 
  onAddAccount,
  onDisconnect
}: GitHubAccountCardProps) {
  const { setDefaultGitHubAccount } = useGitHubConnection();
  
  const handleSetDefault = async (accountId: string) => {
    await setDefaultGitHubAccount(accountId);
  };
  
  return (
    <Card className="bg-background/30 border border-neon-blue/20 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Github className="h-4 w-4 text-neon-blue" />
          GitHub Account
        </h3>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={onAddAccount}
            title="Add another account"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
            onClick={onDisconnect}
            title="Disconnect"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="bg-background/40 rounded-md p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-neon-blue/20 flex items-center justify-center">
            <User className="h-4 w-4 text-neon-blue" />
          </div>
          <div>
            <p className="text-sm font-medium text-neon-blue">@{username}</p>
            <p className="text-xs text-muted-foreground">Current account</p>
          </div>
        </div>
        
        {accounts.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 px-2"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {accounts.map(account => (
                <DropdownMenuItem 
                  key={account.id}
                  disabled={account.default}
                  onClick={() => handleSetDefault(account.id)}
                  className={account.default ? "bg-muted/50 text-neon-blue font-medium" : ""}
                >
                  <Github className="h-4 w-4 mr-2" />
                  @{account.username}
                  {account.default && <span className="ml-auto text-xs opacity-70">Current</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
}
