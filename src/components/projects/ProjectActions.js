import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Github } from "lucide-react";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
export function ProjectActions({ onAddProject, onImportProject }) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { isConnected } = useGitHubConnection();
    const handleImportClick = () => {
        logger.info("GitHub import button clicked");
        if (!isConnected) {
            logger.warn("GitHub import attempted without connection");
            toast.error("You need to connect your GitHub account first");
            return;
        }
        setIsImportModalOpen(true);
    };
    const handleImportComplete = (projectId) => {
        logger.info("GitHub import completed", { projectId });
        if (onImportProject) {
            onImportProject(projectId);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col gap-2 w-full", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: onAddProject, className: "gap-1 w-full justify-start", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Project"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleImportClick, className: "gap-1 w-full justify-start", children: [_jsx(Github, { className: "h-4 w-4" }), "Import from GitHub"] })] }), _jsx(GitHubImportModal, { isOpen: isImportModalOpen, onClose: () => setIsImportModalOpen(false), onImportComplete: handleImportComplete })] }));
}
