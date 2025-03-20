import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
/**
 * Hook for tracking project indexing status
 */
export function useProjectIndexing() {
    const { user } = useAuthStore();
    const [isIndexing, setIsIndexing] = useState(false);
    const [recentlyImportedProject, setRecentlyImportedProject] = useState(null);
    const checkIndexingStatus = useCallback(async (projectId) => {
        if (!user?.id)
            return;
        try {
            // Check if there are recent vector entries for this project
            const { data: vectors } = await supabase
                .from('project_vectors')
                .select('created_at')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })
                .limit(1);
            if (vectors && vectors.length > 0) {
                // If vectors were created in the last 5 minutes, consider it as indexing
                const vectorCreatedAt = new Date(vectors[0].created_at);
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                if (vectorCreatedAt > fiveMinutesAgo) {
                    setIsIndexing(true);
                    // Get project details from Supabase to show repo name
                    const { data: project } = await supabase
                        .from('projects')
                        .select('github_repo')
                        .eq('id', projectId)
                        .single();
                    if (project?.github_repo) {
                        const repoName = project.github_repo.split('/').pop() || '';
                        setRecentlyImportedProject({ id: projectId, repoName });
                    }
                    // Reset after some time (simulating completion)
                    setTimeout(() => {
                        setIsIndexing(false);
                        setRecentlyImportedProject(null);
                    }, 15000);
                }
            }
        }
        catch (error) {
            console.error("Error checking indexing status:", error);
        }
    }, [user?.id]);
    const simulateIndexing = async (projectId) => {
        try {
            setIsIndexing(true);
            const { data: project } = await supabase
                .from('projects')
                .select('github_repo')
                .eq('id', projectId)
                .single();
            if (project?.github_repo) {
                const repoName = project.github_repo.split('/').pop() || '';
                setRecentlyImportedProject({ id: projectId, repoName });
            }
            // Reset after some time (simulating completion)
            setTimeout(() => {
                setIsIndexing(false);
                setRecentlyImportedProject(null);
            }, 15000);
        }
        catch (error) {
            console.error("Error simulating indexing:", error);
        }
    };
    return {
        isIndexing,
        recentlyImportedProject,
        checkIndexingStatus,
        simulateIndexing
    };
}
