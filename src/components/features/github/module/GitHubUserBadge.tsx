
import { cn } from "@/lib/utils";
import { GithubIcon } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubProfileDialog } from "./GitHubProfileDialog";

interface GitHubUserBadgeProps {
  username: string | null;
  className?: string;
}

export function GitHubUserBadge({ username, className }: GitHubUserBadgeProps) {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  if (!username) return null;
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setIsProfileDialogOpen(true)}
              className={cn(
                "flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/90 transition-colors",
                "border border-neon-blue/30 rounded-full px-2 py-0.5",
                "bg-gradient-to-r from-neon-blue/10 to-neon-pink/10 backdrop-blur-sm",
                "hover:border-neon-blue/50 hover:shadow-[0_0_8px_theme(colors.neon.blue)]",
                className
              )}
            >
              <GithubIcon className="h-3 w-3" />
              <span>@{username}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View GitHub profile for @{username}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <GitHubProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        username={username}
      />
    </>
  );
}
