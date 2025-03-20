import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectEventService } from "@/services/projects/ProjectEventService";
import { RAGTierService } from "@/services/rag/RAGTierService";
import { RAGIndexingService } from "@/services/rag/RAGIndexingService";
import { toast } from "sonner";
import { useProjectVectors } from "@/hooks/rag/useProjectVectors";
import { useRAGTier } from "@/hooks/rag/useRAGTier";
export const useProjectActivation = () => {
    const [isActivating, setIsActivating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isIndexing, setIsIndexing] = useState(false);
    const queryClient = useQueryClient();
    const { shouldMigrate, vectorLimitStatus, handleUpgradePrompt } = useProjectVectors();
    const { migrateProjectToPremium } = useRAGTier();
    const activateProject = async (userId, projectId) => {
        setIsActivating(true);
        try {
            await ProjectEventService.setActiveProject(userId, projectId);
            // Refresh project data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['active-project'] });
            toast.success("Project activated successfully");
            // Check if project should be migrated to premium RAG
            if (await RAGTierService.shouldMigrateToPreium(projectId)) {
                toast("Vector storage recommendation", {
                    description: "This project has a large number of vectors. Consider upgrading to premium RAG for better performance.",
                    action: {
                        label: "Upgrade",
                        onClick: () => migrateProjectToPremium(projectId)
                    }
                });
            }
            // Also check vector limits
            const limitStatus = await queryClient.fetchQuery({
                queryKey: ['vector-limit-status', projectId],
                queryFn: () => RAGTierService.shouldMigrateToPreium(projectId)
            });
            if (limitStatus) {
                handleUpgradePrompt();
            }
        }
        catch (error) {
            console.error("Error activating project:", error);
            toast.error("Failed to activate project");
        }
        finally {
            setIsActivating(false);
        }
    };
    const createProject = async (userId, projectData) => {
        setIsCreating(true);
        try {
            // Create project in Supabase
            const { data, error } = await ProjectEventService.createProject(userId, projectData);
            if (error)
                throw error;
            // Notify the system about the new project
            await notifyProjectCreated(userId, data.id);
            // Start indexing the project in the background
            setIsIndexing(true);
            await RAGIndexingService.indexProject(data.id);
            // Refresh project data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['active-project'] });
            toast.success("Project created successfully");
            return data;
        }
        catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project");
            throw error;
        }
        finally {
            setIsCreating(false);
            setIsIndexing(false);
        }
    };
    const notifyProjectCreated = async (userId, projectId) => {
        try {
            await ProjectEventService.notifyProjectCreated(userId, projectId);
            // Refresh project data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['active-project'] });
            toast.success("Project created successfully");
        }
        catch (error) {
            console.error("Error notifying project creation:", error);
            toast.error("Failed to register new project");
        }
    };
    const notifyProjectImported = async (userId, projectId) => {
        try {
            await ProjectEventService.notifyProjectImported(userId, projectId);
            // Refresh project data
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['active-project'] });
            toast.success("Project imported successfully");
            // Start indexing the imported project
            setIsIndexing(true);
            await RAGIndexingService.indexProject(projectId);
        }
        catch (error) {
            console.error("Error notifying project import:", error);
            toast.error("Failed to register imported project");
        }
        finally {
            setIsIndexing(false);
        }
    };
    return {
        activateProject,
        createProject,
        notifyProjectCreated,
        notifyProjectImported,
        isActivating,
        isCreating,
        isIndexing
    };
};
