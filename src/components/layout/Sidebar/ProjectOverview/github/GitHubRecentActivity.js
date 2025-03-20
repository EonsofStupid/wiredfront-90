import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Loader2, GitCommit, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
export function GitHubRecentActivity({ username }) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchActivities();
    }, [username]);
    const fetchActivities = async () => {
        setLoading(true);
        try {
            // In a real implementation, this would fetch from your Supabase database
            // For now, we'll use mock data
            const mockActivities = [
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
        }
        catch (error) {
            console.error("Error fetching GitHub activities:", error);
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center py-6", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-neon-blue/50" }) }));
    }
    if (activities.length === 0) {
        return (_jsxs("div", { className: "text-center py-4 text-muted-foreground text-sm", children: [_jsx(Clock, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }), _jsx("p", { children: "No recent activity" })] }));
    }
    return (_jsxs("div", { className: "space-y-2", children: [activities.map(activity => (_jsxs("div", { className: "bg-background/40 rounded-md p-2 text-xs border border-neon-blue/10", children: [_jsxs("div", { className: "flex items-center gap-1 mb-1", children: [_jsx(GitCommit, { className: "h-3 w-3 text-neon-pink" }), _jsx("span", { className: "font-medium", children: activity.repo })] }), _jsx("p", { className: "truncate", children: activity.message }), _jsx("p", { className: "text-muted-foreground text-[10px] mt-1", children: formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) })] }, activity.id))), _jsx(Button, { variant: "ghost", size: "sm", className: "w-full text-xs text-muted-foreground hover:text-neon-blue mt-2", onClick: () => window.location.href = '/settings?tab=github-repos', children: "View all activity" })] }));
}
