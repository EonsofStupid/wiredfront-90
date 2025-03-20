import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { ProjectIndexingStatus } from "@/components/projects/ProjectIndexingStatus";
export function IndexingStatusSection({ isIndexing, recentlyImportedProject, className }) {
    if (!isIndexing || !recentlyImportedProject) {
        return null;
    }
    return (_jsx("div", { className: cn("p-4 border-b border-neon-blue/20", "bg-gradient-to-r from-dark-lighter/20 to-dark-lighter/5", className), children: _jsx(ProjectIndexingStatus, { projectId: recentlyImportedProject.id, repoName: recentlyImportedProject.repoName }) }));
}
