import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GithubIcon, ExternalLinkIcon, UsersIcon, BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export function GitHubProfileDialog({ open, onOpenChange, username }) {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (open && username) {
            fetchGitHubProfile(username);
        }
        return () => {
            setProfileData(null);
            setError(null);
        };
    }, [open, username]);
    const fetchGitHubProfile = async (username) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch GitHub profile: ${response.statusText}`);
            }
            const data = await response.json();
            setProfileData(data);
        }
        catch (err) {
            console.error("Error fetching GitHub profile:", err);
            setError("Could not load GitHub profile information");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px] border-neon-blue/30 bg-dark-lighter/50 backdrop-blur-md", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "flex items-center gap-2 text-neon-blue", children: [_jsx(GithubIcon, { className: "h-5 w-5" }), "GitHub Profile"] }) }), isLoading ? (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Skeleton, { className: "h-16 w-16 rounded-full" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-32" }), _jsx(Skeleton, { className: "h-3 w-24" })] })] }), _jsx(Skeleton, { className: "h-4 w-full" }), _jsx(Skeleton, { className: "h-4 w-3/4" }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Skeleton, { className: "h-8 w-24" }), _jsx(Skeleton, { className: "h-8 w-24" })] })] })) : error ? (_jsx("div", { className: "py-4 text-neon-pink", children: _jsx("p", { children: error }) })) : profileData ? (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("img", { src: profileData.avatar_url, alt: `${username}'s GitHub avatar`, className: "h-16 w-16 rounded-full ring-2 ring-neon-blue/30" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white", children: profileData.name || username }), _jsxs("p", { className: "text-sm text-neon-blue", children: ["@", username] })] })] }), profileData.bio && (_jsx("p", { className: "text-sm text-gray-300", children: profileData.bio })), _jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-sm text-gray-300", children: [_jsx(UsersIcon, { className: "h-4 w-4 text-neon-blue/70" }), _jsxs("span", { children: [profileData.followers, " followers"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-sm text-gray-300", children: [_jsx(BookIcon, { className: "h-4 w-4 text-neon-blue/70" }), _jsxs("span", { children: [profileData.public_repos, " repositories"] })] })] }), _jsxs(Button, { variant: "outline", className: "w-full border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10", onClick: () => window.open(profileData.html_url, '_blank'), children: [_jsx(ExternalLinkIcon, { className: "mr-2 h-4 w-4" }), "View on GitHub"] })] })) : (_jsx("div", { className: "py-4 text-center text-gray-400", children: _jsx("p", { children: "Loading GitHub profile..." }) }))] }) }));
}
