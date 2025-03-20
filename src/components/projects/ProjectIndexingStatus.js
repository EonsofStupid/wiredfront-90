import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DatabaseIcon, InfoIcon } from "lucide-react";
export function ProjectIndexingStatus({ projectId, repoName }) {
    const [indexingStatus, setIndexingStatus] = useState({
        status: "pending",
        progress: 0,
        files_processed: 0,
        total_files: 0
    });
    // In a real implementation, this would connect to a WebSocket or polling API
    // to get real-time updates on indexing progress
    useEffect(() => {
        const simulateIndexing = () => {
            // This is just a simulation - in reality, you'd connect to a WebSocket
            const interval = setInterval(() => {
                setIndexingStatus(prev => {
                    if (prev.status === "completed" || prev.status === "error") {
                        clearInterval(interval);
                        return prev;
                    }
                    const newProgress = Math.min(prev.progress + 5, 100);
                    const newFilesProcessed = Math.floor((newProgress / 100) * 20); // Assuming 20 files total
                    if (newProgress === 100) {
                        clearInterval(interval);
                        return {
                            status: "completed",
                            progress: 100,
                            files_processed: 20,
                            total_files: 20
                        };
                    }
                    return {
                        status: prev.progress === 0 ? "pending" : "processing",
                        progress: newProgress,
                        files_processed: newFilesProcessed,
                        total_files: 20
                    };
                });
            }, 500);
            return () => clearInterval(interval);
        };
        const timer = setTimeout(simulateIndexing, 1000);
        return () => clearTimeout(timer);
    }, [projectId]);
    if (indexingStatus.status === "completed") {
        return (_jsxs(Alert, { className: "border border-neon-blue/30 bg-neon-blue/10 text-neon-blue", children: [_jsx(DatabaseIcon, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Project Indexing Complete" }), _jsxs(AlertDescription, { className: "text-gray-300", children: ["Your project has been successfully indexed for AI-assisted development.", indexingStatus.files_processed, " files processed."] })] }));
    }
    return (_jsxs(Alert, { className: "border border-neon-pink/30 bg-neon-pink/5", children: [_jsx(InfoIcon, { className: "h-4 w-4 text-neon-pink" }), _jsx(AlertTitle, { className: "text-neon-pink", children: indexingStatus.status === "pending" ? "Preparing to Index" : "Indexing Project" }), _jsxs(AlertDescription, { className: "space-y-2 text-gray-300", children: [_jsx("p", { children: indexingStatus.status === "pending"
                            ? "Getting ready to analyze your repository..."
                            : `Processing ${repoName} for AI-assisted development` }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsxs("span", { children: [indexingStatus.files_processed, " of ", indexingStatus.total_files, " files"] }), _jsxs("span", { children: [indexingStatus.progress, "%"] })] }), _jsx(Progress, { value: indexingStatus.progress, className: "h-2", indicatorClassName: "bg-gradient-to-r from-neon-blue to-neon-pink" })] })] })] }));
}
