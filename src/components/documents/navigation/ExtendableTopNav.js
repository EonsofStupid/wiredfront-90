import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Github, FolderGit2, Key, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const ExtendableTopNav = ({ className }) => {
    const [isExtended, setIsExtended] = useState(true);
    const [iconOnly, setIconOnly] = useState(false);
    const [isGithubAuthenticated, setIsGithubAuthenticated] = useState(false);
    // Auto-extend on page load
    useEffect(() => {
        setIsExtended(true);
    }, []);
    const handleGithubAuth = async () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        if (!clientId) {
            console.error('GitHub Client ID is not configured');
            return;
        }
        const scope = 'repo';
        const redirectUri = `${window.location.origin}/api/github/callback`;
        const authUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `scope=${scope}`;
        // Open GitHub auth in a popup window
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const popup = window.open(authUrl, 'Github Authorization', `width=${width},height=${height},left=${left},top=${top}`);
        // Listen for the popup window to close
        const checkPopup = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(checkPopup);
                // Check if authentication was successful
                fetch('/api/github/check-auth')
                    .then(res => res.json())
                    .then(data => {
                    setIsGithubAuthenticated(data.authenticated);
                })
                    .catch(err => {
                    console.error('Error checking auth status:', err);
                });
            }
        }, 1000);
    };
    return (_jsx("div", { className: cn("fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out z-[var(--z-navbar)]", isExtended ? "translate-y-0" : "-translate-y-[calc(100%-0.75rem)]", className), children: _jsxs("div", { className: "glass-card border-neon-border relative", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: cn("transition-colors", isGithubAuthenticated
                                                        ? "text-neon-green hover:text-neon-pink"
                                                        : "text-neon-blue hover:text-neon-pink"), onClick: handleGithubAuth, children: _jsx(Github, { className: "h-5 w-5" }) }) }), _jsx(TooltipContent, { children: isGithubAuthenticated ? 'Connected to GitHub' : 'Connect GitHub' })] }) }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-blue hover:text-neon-pink", children: _jsx(FolderGit2, { className: "h-5 w-5" }) }) }), _jsx(TooltipContent, { children: "Repositories" })] }) }), _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-blue hover:text-neon-pink", children: _jsx(Key, { className: "h-5 w-5" }) }) }), _jsx(TooltipContent, { children: "Personal Access Token" })] }) })] }), !iconOnly && (_jsxs("div", { className: "flex items-center space-x-6", children: [_jsx(Button, { variant: "ghost", className: "text-foreground hover:text-neon-pink transition-colors", children: "Files" }), _jsx(Button, { variant: "ghost", className: "text-foreground hover:text-neon-pink transition-colors", children: "Images" }), _jsx(Button, { variant: "ghost", className: "text-foreground hover:text-neon-pink transition-colors", children: "Projects" })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-blue hover:text-neon-pink", children: _jsx(Search, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-blue hover:text-neon-pink", children: _jsx(Bell, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIconOnly(!iconOnly), className: "text-neon-blue hover:text-neon-pink", children: iconOnly ? (_jsx(ChevronDown, { className: "h-5 w-5" })) : (_jsx(ChevronUp, { className: "h-5 w-5" })) })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsExtended(!isExtended), className: cn("absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-2px)]", "text-neon-blue hover:text-neon-pink rounded-t-none rounded-b-lg", "border border-t-0 border-white/10 bg-dark-lighter/30 backdrop-blur-md", "w-12 h-6 p-0 flex items-center justify-center"), children: isExtended ? (_jsx(ChevronUp, { className: "h-4 w-4" })) : (_jsx(ChevronDown, { className: "h-4 w-4" })) })] }) }));
};
