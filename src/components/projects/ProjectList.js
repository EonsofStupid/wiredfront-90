import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Folder, Github, Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
export function ProjectList({ projects, activeProjectId, onSelectProject, onAddProject, onImportProject, onDeleteProject, isGithubConnected, isLoading = false }) {
    const [projectToDelete, setProjectToDelete] = useState(null);
    const handleDeleteProject = (id, e) => {
        e.stopPropagation();
        setProjectToDelete(id);
    };
    const confirmDelete = () => {
        if (projectToDelete) {
            onDeleteProject(projectToDelete);
            setProjectToDelete(null);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-4 border-t border-neon-blue/20 bg-gradient-to-b from-dark-lighter/20 to-dark-lighter/5", children: [_jsx("h3", { className: "text-sm font-medium text-neon-blue/90 mb-3", children: "My Projects" }), _jsx(ScrollArea, { className: "max-h-[180px] pr-3 -mr-3", children: _jsx("div", { className: "space-y-2", children: isLoading ? (_jsx("div", { className: "py-4 text-center", children: _jsx("p", { className: "text-sm text-gray-400", children: "Loading projects..." }) })) : projects.length > 0 ? (projects.map((project) => (_jsxs(Button, { variant: "ghost", className: cn("w-full justify-start gap-2 h-auto py-2 px-3", "text-left hover:bg-dark-lighter/30 group", "border border-transparent transition-all duration-200", activeProjectId === project.id && "bg-dark-lighter/50 text-neon-blue border-neon-blue/20"), onClick: () => onSelectProject(project.id), children: [_jsx(Folder, { className: cn("w-4 h-4 shrink-0", activeProjectId === project.id ? "text-neon-blue" : "text-gray-400 group-hover:text-neon-blue/70") }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [_jsx("p", { className: "truncate text-sm font-medium", children: project.name }), _jsx("p", { className: "truncate text-xs opacity-70", children: formatDistanceToNow(new Date(project.updated_at), { addSuffix: true }) })] }), _jsx("button", { onClick: (e) => handleDeleteProject(project.id, e), className: "opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(Trash2, { className: "w-4 h-4 text-gray-400 hover:text-red-500" }) })] }, project.id)))) : (_jsx("div", { className: "text-center py-3", children: _jsx("p", { className: "text-sm text-gray-400", children: "No projects yet" }) })) }) }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "w-full justify-start border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/50", onClick: onAddProject, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "New Project"] }), _jsxs(Button, { variant: "outline", size: "sm", className: cn("w-full justify-start", isGithubConnected
                                    ? "border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 hover:border-neon-pink/50"
                                    : "border-gray-700 text-gray-400 opacity-70 hover:bg-gray-800/50"), onClick: onImportProject, disabled: !isGithubConnected, children: [_jsx(Github, { className: "w-4 h-4 mr-2" }), "Import from GitHub"] })] })] }), _jsx(AlertDialog, { open: !!projectToDelete, onOpenChange: (open) => !open && setProjectToDelete(null), children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Delete Project" }), _jsx(AlertDialogDescription, { children: "Are you sure you want to delete this project? This action cannot be undone." })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Cancel" }), _jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-red-500 hover:bg-red-600", children: "Delete" })] })] }) })] }));
}
