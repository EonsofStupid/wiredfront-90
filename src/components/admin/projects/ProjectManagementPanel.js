import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity, Archive, CheckCircle, XCircle, Calendar, Github, User } from "lucide-react";
export const ProjectManagementPanel = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: projects, isLoading: projectsLoading, error, refetch } = useQuery({
        queryKey: ['admin', 'projects'],
        queryFn: async () => {
            // Get projects data
            const { data: projectsData, error: projectsError } = await supabase
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false }); // Type assertion needed because the projects table is not in the types
            if (projectsError)
                throw projectsError;
            // Get profile data to map usernames
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, username');
            if (profileError)
                throw profileError;
            // Map usernames to projects
            const projectsWithUsernames = projectsData.map((project) => {
                const profile = profiles.find((p) => p.id === project.user_id);
                return {
                    ...project,
                    username: profile?.username || project.user_id.substring(0, 8)
                };
            });
            return projectsWithUsernames;
        }
    });
    const setActiveProject = async (userId, projectId) => {
        setIsLoading(true);
        try {
            // First set all user's projects to inactive
            const { error: updateError } = await supabase
                .from('projects')
                .update({ is_active: false })
                .eq('user_id', userId); // Type assertion
            if (updateError)
                throw updateError;
            // Then set the selected project to active
            const { error: activateError } = await supabase
                .from('projects')
                .update({ is_active: true })
                .eq('id', projectId); // Type assertion
            if (activateError)
                throw activateError;
            toast.success("Project activated successfully");
            refetch();
        }
        catch (error) {
            console.error("Error setting active project:", error);
            toast.error("Failed to set active project");
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateProjectStatus = async (projectId, status) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                status,
                updated_at: new Date().toISOString()
            })
                .eq('id', projectId); // Type assertion
            if (error)
                throw error;
            toast.success(`Project status updated to ${status}`);
            refetch();
        }
        catch (error) {
            console.error("Error updating project status:", error);
            toast.error("Failed to update project status");
        }
        finally {
            setIsLoading(false);
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return _jsxs(Badge, { className: "bg-green-500 flex items-center gap-1", children: [_jsx(Activity, { className: "h-3 w-3" }), " Active"] });
            case 'archived':
                return _jsxs(Badge, { className: "bg-yellow-500 flex items-center gap-1", children: [_jsx(Archive, { className: "h-3 w-3" }), " Archived"] });
            case 'deleted':
                return _jsxs(Badge, { className: "bg-red-500 flex items-center gap-1", children: [_jsx(XCircle, { className: "h-3 w-3" }), " Deleted"] });
            default:
                return _jsx(Badge, { children: status });
        }
    };
    if (projectsLoading)
        return _jsx("div", { children: "Loading project data..." });
    if (error)
        return _jsxs("div", { children: ["Error loading project data: ", error.message] });
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Project Management" }), _jsx(CardDescription, { children: "Monitor and manage user projects. Only one project per user can be active at a time." })] }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Project Name" }), _jsx(TableHead, { children: "User" }), _jsx(TableHead, { children: "GitHub Repo" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Active" }), _jsx(TableHead, { children: "Actions" })] }) }), _jsx(TableBody, { children: projects?.map(project => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: project.name }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { className: "h-4 w-4" }), _jsx("span", { children: project.username })] }) }), _jsx(TableCell, { children: project.github_repo && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Github, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs truncate max-w-[120px]", children: project.github_repo })] })) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: new Date(project.created_at).toLocaleDateString() })] }) }), _jsx(TableCell, { children: getStatusBadge(project.status) }), _jsx(TableCell, { children: project.is_active ?
                                            _jsx(CheckCircle, { className: "h-5 w-5 text-green-500" }) :
                                            _jsx(XCircle, { className: "h-5 w-5 text-gray-400" }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", disabled: project.is_active || isLoading, onClick: () => setActiveProject(project.user_id, project.id), children: "Set Active" }), _jsx(Button, { variant: "outline", size: "sm", disabled: project.status === 'archived' || isLoading, onClick: () => updateProjectStatus(project.id, 'archived'), children: "Archive" })] }) })] }, project.id))) })] }) })] }));
};
