import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { logger } from "@/services/chat/LoggingService";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
export function ProjectContentSection({ activeProject, isGithubConnected, githubUsername, onAddProject, onImportComplete }) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const handleOpenImportModal = () => {
        logger.info("Import from GitHub button clicked");
        if (!isGithubConnected) {
            logger.warn("GitHub import attempted without connection");
            return;
        }
        setIsImportModalOpen(true);
    };
    if (activeProject) {
        return (_jsx(ProjectDetails, { project: activeProject, isGithubConnected: isGithubConnected, githubUsername: githubUsername }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center justify-center h-full p-4 space-y-6", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("h3", { className: "text-lg font-medium", children: "No Project Selected" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Create a new project or select one from the list below" })] }), _jsx(ProjectActions, { onAddProject: onAddProject, onImportProject: handleOpenImportModal })] }), _jsx(GitHubImportModal, { isOpen: isImportModalOpen, onClose: () => setIsImportModalOpen(false), onImportComplete: onImportComplete })] }));
}
