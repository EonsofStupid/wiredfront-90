
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, GitCommit, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface GitHubActivity {
  id: string;
  type: string;
  repo: string;
  message: string;
  timestamp: string;
}

interface GitHubRecentActivityProps {
  username: string | null;
}

export function GitHubRecentActivity({ username }: GitHubRecentActivityProps) {
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchActivities();
  }, [username]);
  
  const fetchActivities = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from your Supabase database
      // For now, we'll use mock data
      const mockActivities: GitHubActivity[] = [
        {
          id: '1',
          type: 'commit',
          repo: 'user/repo1',
          message: 'Update README.md',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: '2',
          type: 'push',
          repo: 'user/repo2',
          message: 'Fix styling issues',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
        },
        {
          id: '3',
          type: 'sync',
          repo: 'user/repo1',
          message: 'Pull latest changes',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setActivities(mockActivities);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error("Error fetching GitHub activities:", error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-neon-blue/50" />
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {activities.map(activity => (
        <div 
          key={activity.id}
          className="bg-background/40 rounded-md p-2 text-xs border border-neon-blue/10"
        >
          <div className="flex items-center gap-1 mb-1">
            <GitCommit className="h-3 w-3 text-neon-pink" />
            <span className="font-medium">{activity.repo}</span>
          </div>
          <p className="truncate">{activity.message}</p>
          <p className="text-muted-foreground text-[10px] mt-1">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </p>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-xs text-muted-foreground hover:text-neon-blue mt-2"
        onClick={() => window.location.href = '/settings?tab=github-repos'}
      >
        View all activity
      </Button>
    </div>
  );
}
