import React, { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useProjects } from '@/hooks/useProjects';
import { projectEventService } from '@/services/project/ProjectEventService';

interface ProjectOnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectOnboardingDialog({ open, onOpenChange }: ProjectOnboardingDialogProps) {
  const [projectName, setProjectName] = useState('');
  const { createProject } = useProjects();

  const handleCreateProject = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error('Project name cannot be empty.');
      return;
    }

    try {
      const newProject = await createProject({ name: projectName });
      if (newProject) {
        toast.success('Project created successfully!');
        projectEventService.emit('projectCreated', newProject);
        onOpenChange(false);
        setProjectName('');
      } else {
        toast.error('Failed to create project.');
      }
    } catch (error) {
      toast.error(`Failed to create project: ${error}`);
    }
  }, [projectName, createProject, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Create Project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create New Project</AlertDialogTitle>
          <AlertDialogDescription>
            Enter a name for your new project. This will help you organize your
            tasks and resources.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateProject}>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
