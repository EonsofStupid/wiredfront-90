
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GithubIcon, ExternalLinkIcon, UsersIcon, StarIcon, BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubProfileData {
  avatar_url: string;
  name: string | null;
  bio: string | null;
  followers: number;
  public_repos: number;
  html_url: string;
}

interface GitHubProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function GitHubProfileDialog({ open, onOpenChange, username }: GitHubProfileDialogProps) {
  const [profileData, setProfileData] = useState<GitHubProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (open && username) {
      fetchGitHubProfile(username);
    }
    
    return () => {
      setProfileData(null);
      setError(null);
    };
  }, [open, username]);
  
  const fetchGitHubProfile = async (username: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching GitHub profile:", err);
      setError("Could not load GitHub profile information");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-neon-blue/30 bg-dark-lighter/50 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-neon-blue">
            <GithubIcon className="h-5 w-5" />
            GitHub Profile
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ) : error ? (
          <div className="py-4 text-neon-pink">
            <p>{error}</p>
          </div>
        ) : profileData ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <img 
                src={profileData.avatar_url} 
                alt={`${username}'s GitHub avatar`} 
                className="h-16 w-16 rounded-full ring-2 ring-neon-blue/30"
              />
              <div>
                <h3 className="text-lg font-medium text-white">{profileData.name || username}</h3>
                <p className="text-sm text-neon-blue">@{username}</p>
              </div>
            </div>
            
            {profileData.bio && (
              <p className="text-sm text-gray-300">{profileData.bio}</p>
            )}
            
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <UsersIcon className="h-4 w-4 text-neon-blue/70" />
                <span>{profileData.followers} followers</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-gray-300">
                <BookIcon className="h-4 w-4 text-neon-blue/70" />
                <span>{profileData.public_repos} repositories</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
              onClick={() => window.open(profileData.html_url, '_blank')}
            >
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              View on GitHub
            </Button>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-400">
            <p>Loading GitHub profile...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
