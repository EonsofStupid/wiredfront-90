
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Activity, 
  Archive, 
  CheckCircle, 
  XCircle,
  Calendar, 
  Github,
  User
} from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  github_repo: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_active: boolean;
  username?: string; // Will be added manually
}

export const ProjectManagementPanel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: projects, isLoading: projectsLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: async (): Promise<Project[]> => {
      // Get projects data
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false }) as any; // Type assertion needed because the projects table is not in the types

      if (projectsError) throw projectsError;
      
      // Get profile data to map usernames
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username');
        
      if (profileError) throw profileError;
      
      // Map usernames to projects
      const projectsWithUsernames = projectsData.map((project: any) => {
        const profile = profiles.find((p: any) => p.id === project.user_id);
        return {
          ...project,
          username: profile?.username || project.user_id.substring(0, 8)
        };
      });
      
      return projectsWithUsernames;
    }
  });

  const setActiveProject = async (userId: string, projectId: string) => {
    setIsLoading(true);
    try {
      // First set all user's projects to inactive
      const { error: updateError } = await supabase
        .from('projects')
        .update({ is_active: false })
        .eq('user_id', userId) as any; // Type assertion
      
      if (updateError) throw updateError;
      
      // Then set the selected project to active
      const { error: activateError } = await supabase
        .from('projects')
        .update({ is_active: true })
        .eq('id', projectId) as any; // Type assertion
        
      if (activateError) throw activateError;
      
      toast.success("Project activated successfully");
      refetch();
    } catch (error) {
      console.error("Error setting active project:", error);
      toast.error("Failed to set active project");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId) as any; // Type assertion
        
      if (error) throw error;
      
      toast.success(`Project status updated to ${status}`);
      refetch();
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update project status");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 flex items-center gap-1"><Activity className="h-3 w-3" /> Active</Badge>;
      case 'archived':
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Archive className="h-3 w-3" /> Archived</Badge>;
      case 'deleted':
        return <Badge className="bg-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" /> Deleted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (projectsLoading) return <div>Loading project data...</div>;
  if (error) return <div>Error loading project data: {(error as Error).message}</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
        <CardDescription>
          Monitor and manage user projects. Only one project per user can be active at a time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>GitHub Repo</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map(project => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{project.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {project.github_repo && (
                    <div className="flex items-center space-x-2">
                      <Github className="h-4 w-4" />
                      <span className="text-xs truncate max-w-[120px]">{project.github_repo}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell>
                  {project.is_active ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                    <XCircle className="h-5 w-5 text-gray-400" />
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={project.is_active || isLoading}
                      onClick={() => setActiveProject(project.user_id, project.id)}
                    >
                      Set Active
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={project.status === 'archived' || isLoading}
                      onClick={() => updateProjectStatus(project.id, 'archived')}
                    >
                      Archive
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
