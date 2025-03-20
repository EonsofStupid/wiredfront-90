import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Menu, Search, Bell, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileMenu } from "../hooks/useMobileMenu";
import { MobilePageTitle } from "./MobilePageTitle";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { MobileGitHubConnectModal } from "../components/github/MobileGitHubConnectModal";
/**
 * Mobile header component with menu button, page title and GitHub integration
 */
export const MobileHeader = () => {
    const { toggleMenu } = useMobileMenu();
    const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
    const { isConnected, isChecking, connectionStatus, githubUsername, connectGitHub, disconnectGitHub } = useGitHubConnection();
    return (_jsxs("header", { className: "mobile-header", children: [_jsxs("div", { className: "flex items-center justify-between px-4 h-full", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", onClick: toggleMenu, children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsx(MobilePageTitle, {}), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "ghost", size: "icon", className: `relative ${isConnected ? 'text-green-500 hover:text-green-400' : 'text-neon-pink hover:text-neon-blue'}`, onClick: () => setIsGitHubModalOpen(true), children: [_jsx(Github, { className: "h-5 w-5" }), isConnected && (_jsx("span", { className: "absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" }))] }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", children: _jsx(Search, { className: "h-5 w-5" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", children: _jsx(Bell, { className: "h-5 w-5" }) })] })] }), _jsx(MobileGitHubConnectModal, { isOpen: isGitHubModalOpen, onClose: () => setIsGitHubModalOpen(false), isConnected: isConnected, isChecking: isChecking, connectionStatus: connectionStatus, githubUsername: githubUsername, onConnect: connectGitHub, onDisconnect: disconnectGitHub })] }));
};
