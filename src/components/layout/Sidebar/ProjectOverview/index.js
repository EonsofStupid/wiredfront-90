import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { useProjectOverview } from "./useProjectOverview";
import { ProjectOverviewHeader } from "./ProjectOverviewHeader";
import { GitHubConnectionSection } from "./GitHubConnectionSection";
import { IndexingStatusSection } from "./IndexingStatusSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectList } from "@/components/projects/ProjectList";
import { GitHubConnectDialog } from "@/components/github/GitHubConnectDialog";
import { GitHubImportModal } from "@/components/github/GitHubImportModal";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { GitHubDisconnectDialog } from "@/components/github/GitHubDisconnectDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Folder, Loader2 } from "lucide-react";
import { GitHubManagementTab } from "./GitHubManagementTab";
import { useState, useEffect } from "react";
import { ErrorMessage } from "@/components/ui/error-message";
import { GitHubErrorBoundary } from "@/components/github/GitHubErrorBoundary";
// Fallback component for the GitHub tab
const GitHubTabFallback = () => (_jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-8 w-8 mx-auto mb-3 animate-spin text-neon-blue/50" }), _jsx("p", { className: "text-muted-foreground", children: "Loading GitHub tab..." })] }) }));
export function ProjectOverview({ className, isCompact = false }) {
    const { projects, activeProject, activeProjectId, isLoadingProjects, isConnected, isChecking, connectionStatus, isIndexing, recentlyImportedProject, isConnectDialogOpen, setIsConnectDialogOpen, isDisconnectDialogOpen, setIsDisconnectDialogOpen, isImportModalOpen, setIsImportModalOpen, githubUsername, errorMessage, linkedAccounts, handleAddProject, handleGitHubConnect, handleImportProject, handleOpenImportModal, handleDeleteProject, connectGitHub, disconnectGitHub, checkConnectionStatus, setActiveProject } = useProjectOverview();
    const [activeTab, setActiveTab] = useState("projects");
    const [tabError, setTabError] = useState(null);
    const [isGithubTabMounted, setIsGithubTabMounted] = useState(false);
    // Handle tab changes safely
    const handleTabChange = (tab) => {
        try {
            setTabError(null);
            // Only mount GitHub tab when selected
            if (tab === "github") {
                setIsGithubTabMounted(true);
            }
            setActiveTab(tab);
        }
        catch (error) {
            console.error("Tab change error:", error);
            setTabError("Failed to switch tabs. Please try again.");
        }
    };
    // Clear error when component remounts or key dependencies change
    useEffect(() => {
        setTabError(null);
    }, [isConnected, githubUsername]);
    return (_jsxs("div", { className: cn("flex flex-col h-full", "bg-gradient-to-br from-dark-lighter/30 to-transparent backdrop-blur-md", "border-neon-blue/20", className), style: { position: 'relative', zIndex: 'var(--z-projecthub)' }, children: [_jsx(ProjectOverviewHeader, {}), _jsx(GitHubConnectionSection, { isConnected: isConnected, isChecking: isChecking, connectionStatus: connectionStatus, username: githubUsername, onConnect: handleGitHubConnect, onDisconnect: () => setIsDisconnectDialogOpen(true) }), _jsx(IndexingStatusSection, { isIndexing: isIndexing, recentlyImportedProject: recentlyImportedProject }), tabError && (_jsx("div", { className: "px-4 mt-2", children: _jsx(ErrorMessage, { message: tabError }) })), _jsxs(Tabs, { value: activeTab, onValueChange: handleTabChange, className: "flex-1 flex flex-col", children: [_jsxs(TabsList, { className: "mx-4 bg-background/30 border border-neon-blue/20", children: [_jsxs(TabsTrigger, { value: "projects", className: "flex items-center gap-1 data-[state=active]:bg-neon-blue/10", children: [_jsx(Folder, { className: "h-4 w-4" }), _jsx("span", { children: "Projects" })] }), _jsxs(TabsTrigger, { value: "github", className: "flex items-center gap-1 data-[state=active]:bg-neon-blue/10", children: [_jsx(Github, { className: "h-4 w-4" }), _jsx("span", { children: "GitHub" })] })] }), _jsxs(TabsContent, { value: "projects", className: "flex-1 flex flex-col mt-0 data-[state=inactive]:hidden", children: [_jsx(ScrollArea, { className: "flex-1", children: activeProject ? (_jsx(ProjectDetails, { project: {
                                        id: activeProject.id,
                                        name: activeProject.name,
                                        description: activeProject.description,
                                        lastModified: new Date(activeProject.updated_at),
                                        github_repo: activeProject.github_repo,
                                        language: activeProject.tech_stack?.primaryLanguage,
                                        files_count: activeProject.tech_stack?.files_count
                                    }, isGithubConnected: isConnected, githubUsername: githubUsername })) : (_jsx("div", { className: "p-4 text-center", children: _jsx("p", { className: "text-sm text-gray-400", children: "No project selected" }) })) }), _jsx(ProjectList, { projects: projects?.map(p => ({
                                    ...p,
                                    lastModified: new Date(p.updated_at)
                                })) || [], activeProjectId: activeProjectId, onSelectProject: setActiveProject, onAddProject: handleAddProject, onImportProject: handleOpenImportModal, onDeleteProject: handleDeleteProject, isGithubConnected: isConnected, isLoading: isLoadingProjects })] }), _jsx(TabsContent, { value: "github", className: "flex-1 flex flex-col mt-0 data-[state=inactive]:hidden", children: _jsx(GitHubErrorBoundary, { children: isGithubTabMounted && (_jsx(GitHubManagementTab, { isConnected: isConnected, githubUsername: githubUsername, connectGitHub: handleGitHubConnect, disconnectGitHub: () => setIsDisconnectDialogOpen(true), isChecking: isChecking, checkConnectionStatus: checkConnectionStatus, linkedAccounts: linkedAccounts, error: errorMessage })) }) })] }), _jsx(GitHubConnectDialog, { open: isConnectDialogOpen, onOpenChange: setIsConnectDialogOpen, onConnect: connectGitHub, errorMessage: errorMessage, connectionStatus: connectionStatus.status }), _jsx(GitHubDisconnectDialog, { open: isDisconnectDialogOpen, onOpenChange: setIsDisconnectDialogOpen, onDisconnect: disconnectGitHub, username: githubUsername }), _jsx(GitHubImportModal, { isOpen: isImportModalOpen, onClose: () => setIsImportModalOpen(false), onImportComplete: handleImportProject })] }));
}
