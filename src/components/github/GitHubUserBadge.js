import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { GithubIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { GitHubProfileDialog } from "./GitHubProfileDialog";
export function GitHubUserBadge({ username, className }) {
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    if (!username)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs("button", { onClick: () => setIsProfileDialogOpen(true), className: cn("flex items-center gap-1.5 text-xs text-neon-blue hover:text-neon-blue/90 transition-colors", "border border-neon-blue/30 rounded-full px-2 py-0.5", "bg-gradient-to-r from-neon-blue/10 to-neon-pink/10 backdrop-blur-sm", "hover:border-neon-blue/50 hover:shadow-[0_0_8px_theme(colors.neon.blue)]", className), children: [_jsx(GithubIcon, { className: "h-3 w-3" }), _jsxs("span", { children: ["@", username] })] }) }), _jsx(TooltipContent, { children: _jsxs("p", { children: ["View GitHub profile for @", username] }) })] }) }), _jsx(GitHubProfileDialog, { open: isProfileDialogOpen, onOpenChange: setIsProfileDialogOpen, username: username })] }));
}
