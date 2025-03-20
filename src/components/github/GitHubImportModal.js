import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";
import { supabase } from "@/integrations/supabase/client";
import { useGitHubConnection } from "@/hooks/github/useGitHubConnection";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Github, Loader2, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { logger } from "@/services/chat/LoggingService";
export function GitHubImportModal({ isOpen, onClose, onImportComplete }) {
    const [repositories, setRepositories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [importedProjectId, setImportedProjectId] = useState(null);
    const [currentStep, setCurrentStep] = useState('select-repo');
    const [searchQuery, setSearchQuery] = useState('');
    const [projectDetails, setProjectDetails] = useState({
        name: '',
        description: '',
        techStack: []
    });
    const { isConnected } = useGitHubConnection();
    useEffect(() => {
        if (isOpen && isConnected) {
            fetchRepositories();
        }
        // Reset state when modal opens
        if (isOpen) {
            setCurrentStep('select-repo');
            setSelectedRepo(null);
            setImportedProjectId(null);
            setError(null);
            setProjectDetails({
                name: '',
                description: '',
                techStack: []
            });
        }
    }, [isOpen, isConnected]);
    const fetchRepositories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            logger.info('Fetching GitHub repositories');
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                logger.error('Authentication required to fetch repositories');
                throw new Error("You must be logged in to import repositories");
            }
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-repo-management`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'fetch-repos'
                })
            });
            // Log the status code for debugging
            logger.debug('GitHub API response status', { status: response.status });
            // Get the raw response text
            const responseText = await response.text();
            logger.debug('GitHub API raw response', { responseText: responseText.substring(0, 500) });
            if (!response.ok) {
                logger.error("GitHub API error response", { status: response.status, text: responseText });
                throw new Error(`Failed to fetch repositories: ${responseText}`);
            }
            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            }
            catch (parseError) {
                logger.error("JSON parsing error", {
                    error: parseError,
                    responseText: responseText.substring(0, 500)
                });
                throw new Error('Invalid response format from server');
            }
            if (!data.success) {
                logger.error("GitHub API unsuccessful response", { error: data.error });
                throw new Error(data.error || "Failed to fetch repositories");
            }
            logger.info(`Successfully fetched ${data.repos?.length || 0} GitHub repositories`);
            setRepositories(data.repos || []);
        }
        catch (error) {
            logger.error("Error fetching repositories", {
                error: error instanceof Error ? error.message : String(error)
            });
            setError(error instanceof Error ? error.message : "Failed to fetch GitHub repositories");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSelectRepo = (repo) => {
        logger.info("Repository selected", { repoName: repo.full_name });
        setSelectedRepo(repo);
        setProjectDetails({
            name: repo.name,
            description: repo.description || '',
            techStack: repo.language ? [repo.language] : []
        });
        setCurrentStep('configure-project');
    };
    const handleImportRepo = async () => {
        if (!selectedRepo)
            return;
        setIsLoading(true);
        setError(null);
        try {
            logger.info("Starting repository import", { repoName: selectedRepo.full_name });
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error("You must be logged in to import a repository");
            }
            // Create a project in the database
            const techStackObj = {
                primaryLanguage: selectedRepo.language || "unknown",
                languages: projectDetails.techStack
            };
            logger.info("Creating project record", {
                projectName: projectDetails.name,
                repo: selectedRepo.full_name
            });
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert({
                name: projectDetails.name,
                description: projectDetails.description,
                github_repo: selectedRepo.full_name,
                tech_stack: techStackObj,
                is_active: true
            })
                .select()
                .single();
            if (projectError || !project) {
                logger.error("Failed to create project", { error: projectError });
                throw new Error(projectError?.message || "Failed to create project");
            }
            logger.info("Project created successfully", { projectId: project.id });
            // Start indexing the repository for RAG
            logger.info("Starting repository indexing", {
                projectId: project.id,
                repoName: selectedRepo.full_name
            });
            const indexResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/github-repo-management`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'index-repo',
                    repoFullName: selectedRepo.full_name,
                    projectId: project.id
                })
            });
            if (!indexResponse.ok) {
                const errorText = await indexResponse.text();
                logger.error("Indexing error response", { errorText });
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                }
                catch (e) {
                    throw new Error('Failed to index repository: ' + errorText);
                }
                throw new Error(errorData.error || 'Failed to index repository');
            }
            const indexData = await indexResponse.json();
            logger.info("Indexing initiated successfully", {
                projectId: project.id,
                message: indexData.message
            });
            setImportedProjectId(project.id);
            setCurrentStep('indexing');
            toast.success("Repository imported successfully!");
        }
        catch (error) {
            logger.error("Error importing repository", {
                error: error instanceof Error ? error.message : String(error),
                repoName: selectedRepo?.full_name
            });
            setError(error instanceof Error ? error.message : "Failed to import repository");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleComplete = () => {
        if (importedProjectId) {
            logger.info("Import completed", { projectId: importedProjectId });
            onImportComplete(importedProjectId);
        }
        onClose();
    };
    const filteredRepos = searchQuery
        ? repositories.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : repositories;
    const handleRetryFetch = () => {
        logger.info("Retrying repository fetch");
        fetchRepositories();
    };
    const renderStepContent = () => {
        switch (currentStep) {
            case 'select-repo':
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search repositories...", className: "pl-9", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), isLoading ? (_jsxs("div", { className: "py-8 flex flex-col items-center justify-center", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary mb-4" }), _jsx("p", { className: "text-muted-foreground", children: "Loading repositories..." })] })) : error ? (_jsxs("div", { className: "py-8 flex flex-col items-center gap-4", children: [_jsx(ErrorMessage, { message: error }), _jsxs(Button, { variant: "outline", onClick: handleRetryFetch, children: [_jsx(Loader2, { className: "h-4 w-4 mr-2" }), "Retry"] })] })) : filteredRepos.length > 0 ? (_jsx("div", { className: "max-h-[400px] overflow-y-auto space-y-2", children: filteredRepos.map((repo) => (_jsxs("div", { className: "p-3 border rounded-md hover:bg-accent cursor-pointer", onClick: () => handleSelectRepo(repo), children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium", children: repo.name }), _jsx("div", { className: "text-sm text-muted-foreground", children: repo.full_name }), repo.description && (_jsx("div", { className: "text-sm mt-1 line-clamp-2", children: repo.description }))] }), _jsxs("div", { className: "flex items-center space-x-1 text-sm text-muted-foreground", children: [_jsx(Star, { className: "h-3.5 w-3.5" }), _jsx("span", { children: repo.stargazers_count })] })] }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [repo.language && (_jsx(Badge, { variant: "outline", className: "text-xs", children: repo.language })), repo.private && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: "Private" }))] })] }, repo.id))) })) : (_jsxs("div", { className: "py-8 text-center", children: [_jsx(Github, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" }), _jsx("h3", { className: "text-lg font-medium mb-1", children: "No repositories found" }), _jsx("p", { className: "text-sm text-muted-foreground", children: searchQuery
                                        ? `No repositories matching "${searchQuery}"`
                                        : "Please make sure your GitHub account has repositories." }), searchQuery && (_jsx(Button, { variant: "outline", className: "mt-4", onClick: () => setSearchQuery(''), children: "Clear search" }))] }))] }));
            case 'configure-project':
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "mb-4 p-3 border rounded-md bg-muted/30", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Github, { className: "h-4 w-4" }), _jsx("span", { className: "font-medium", children: selectedRepo?.full_name })] }), _jsx("div", { className: "text-sm text-muted-foreground", children: selectedRepo?.description || "No description available" })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "project-name", children: "Project Name" }), _jsx(Input, { id: "project-name", value: projectDetails.name, onChange: (e) => setProjectDetails({ ...projectDetails, name: e.target.value }), className: "mt-1" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "project-description", children: "Description" }), _jsx(Textarea, { id: "project-description", value: projectDetails.description, onChange: (e) => setProjectDetails({ ...projectDetails, description: e.target.value }), rows: 3, className: "mt-1" })] }), _jsxs("div", { children: [_jsx(Label, { children: "Tech Stack" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: selectedRepo?.language && (_jsx(Badge, { className: "bg-primary", children: selectedRepo.language })) }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Main language detected from GitHub. You can edit this in project settings later." })] })] }), _jsxs("div", { className: "flex justify-between pt-4", children: [_jsxs(Button, { variant: "outline", onClick: () => setCurrentStep('select-repo'), disabled: isLoading, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back"] }), _jsx(Button, { onClick: handleImportRepo, disabled: isLoading || !projectDetails.name.trim(), children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Importing..."] })) : (_jsxs(_Fragment, { children: ["Import Repository", _jsx(ArrowRight, { className: "h-4 w-4 ml-2" })] })) })] })] }));
            case 'indexing':
                return (_jsxs("div", { className: "space-y-4", children: [_jsx(ProjectIndexingStatus, { projectId: importedProjectId, repoName: selectedRepo?.name || '' }), _jsx("div", { className: "pt-4 flex justify-end", children: _jsxs(Button, { onClick: handleComplete, className: "bg-green-600 hover:bg-green-700", children: [_jsx(Check, { className: "h-4 w-4 mr-2" }), "Complete Import"] }) })] }));
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: _jsxs(DialogContent, { className: "sm:max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Import GitHub Repository" }) }), error && _jsx(ErrorMessage, { message: error, className: "mb-4" }), renderStepContent()] }) }));
}
