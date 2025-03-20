import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Loader2, LockIcon, AlertCircle } from "lucide-react";
import { useRoleStore } from "@/stores/role";
export const AdminCard = ({ children, className, variant = "default", glow = false, isLoading = false, requiredRole, error = null, ...props }) => {
    const { hasRole } = useRoleStore();
    const hasAccess = !requiredRole || hasRole(requiredRole);
    return (_jsxs("div", { className: cn("admin-card relative overflow-hidden rounded-xl border p-5", variant === "accent" && "admin-card-accent", variant === "highlight" && "admin-card-highlight", glow && "admin-card-glow", className), ...props, children: [isLoading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-sm z-10", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-white/80" }) })), !hasAccess && (_jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-dark/80 backdrop-blur-sm z-10 text-white/80", children: [_jsx(LockIcon, { className: "h-12 w-12 mb-3 opacity-70" }), _jsxs("p", { className: "text-center px-6", children: ["You need ", requiredRole, " permissions to access this section"] })] })), error && !isLoading && (_jsxs("div", { className: "mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-red-100", children: error })] })), children] }));
};
export const AdminCardHeader = ({ className, ...props }) => (_jsx("div", { className: cn("mb-3 flex flex-col space-y-1.5", className), ...props }));
export const AdminCardTitle = ({ className, ...props }) => (_jsx("h3", { className: cn("text-xl font-semibold tracking-tight admin-text-gradient", className), ...props }));
export const AdminCardDescription = ({ className, ...props }) => (_jsx("p", { className: cn("text-sm text-muted-foreground", className), ...props }));
export const AdminCardContent = ({ className, ...props }) => (_jsx("div", { className: cn("", className), ...props }));
export const AdminCardFooter = ({ className, ...props }) => (_jsx("div", { className: cn("mt-4 flex items-center pt-2", className), ...props }));
export const AdminCardActions = ({ className, ...props }) => (_jsx("div", { className: cn("flex items-center justify-end gap-2 mt-4 pt-2 border-t border-[#8B5CF6]/20", className), ...props }));
