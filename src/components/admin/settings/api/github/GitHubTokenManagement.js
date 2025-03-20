import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent } from "@/components/admin/ui/AdminCard";
import { GitHubTokenCard } from "./GitHubTokenCard";
import { GitHubTokenDialog } from "./GitHubTokenDialog";
import { PlusCircle, RefreshCw, Github, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRoleStore } from "@/stores/role";
export function GitHubTokenManagement() {
    const [tokens, setTokens] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState(null);
    const { hasRole } = useRoleStore();
    const isSuperAdmin = hasRole('super_admin');
    const fetchTokens = async () => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("You must be logged in to manage GitHub tokens");
                return;
            }
            const result = await supabase.functions.invoke('github-token-management', {
                body: { action: 'get' },
            });
            if (result.error) {
                throw new Error(result.error.message || 'Failed to fetch GitHub tokens');
            }
            setTokens(result.data.tokens || []);
        }
        catch (error) {
            console.error('Error fetching GitHub tokens:', error);
            toast.error('Failed to fetch GitHub tokens');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = (token) => {
        setSelectedToken(token);
        setIsDeleteDialogOpen(true);
    };
    const confirmDelete = async () => {
        if (!selectedToken)
            return;
        try {
            setIsLoading(true);
            const result = await supabase.functions.invoke('github-token-management', {
                body: {
                    action: 'delete',
                    tokenData: {
                        id: selectedToken.id,
                        secret_key_name: selectedToken.secret_key_name
                    }
                },
            });
            if (result.error) {
                throw new Error(result.error.message || 'Failed to delete GitHub token');
            }
            toast.success('GitHub token deleted successfully');
            setIsDeleteDialogOpen(false);
            fetchTokens();
        }
        catch (error) {
            console.error('Error deleting GitHub token:', error);
            toast.error('Failed to delete GitHub token');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleTokenAdded = () => {
        setIsAddDialogOpen(false);
        fetchTokens();
    };
    useEffect(() => {
        fetchTokens();
    }, []);
    return (_jsxs(AdminCard, { requiredRole: "super_admin", children: [_jsxs(AdminCardHeader, { children: [_jsxs(AdminCardTitle, { className: "flex items-center", children: [_jsx(Github, { className: "h-5 w-5 mr-2 text-[#8B5CF6]" }), "GitHub API Tokens"] }), _jsx(AdminCardDescription, { children: "Manage your GitHub API tokens for Git operations and repository access" })] }), _jsxs(AdminCardContent, { children: [!isSuperAdmin && (_jsxs("div", { className: "mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start", children: [_jsx(Shield, { className: "h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm", children: "Only Super Admins can manage GitHub API tokens. These tokens are used for secure GitHub operations and repository access." })] })), isLoading ? (_jsx("div", { className: "py-8 flex justify-center", children: _jsx(RefreshCw, { className: "h-8 w-8 animate-spin text-muted-foreground" }) })) : tokens.length > 0 ? (_jsx("div", { className: "space-y-4", children: tokens.map((token) => (_jsx(GitHubTokenCard, { token: token, onDelete: () => handleDelete(token) }, token.id))) })) : (_jsxs("div", { className: "py-8 text-center", children: [_jsx(Github, { className: "h-12 w-12 mx-auto mb-4 text-muted-foreground" }), _jsx("h3", { className: "text-lg font-medium mb-2", children: "No GitHub Tokens" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "You haven't added any GitHub tokens yet. Tokens are used for secure GitHub operations." })] })), _jsx("div", { className: "mt-6", children: _jsxs(Button, { onClick: () => setIsAddDialogOpen(true), className: "w-full admin-primary-button", disabled: !isSuperAdmin, children: [_jsx(PlusCircle, { className: "h-4 w-4 mr-2" }), "Add GitHub Token"] }) })] }), _jsx(GitHubTokenDialog, { isOpen: isAddDialogOpen, onClose: () => setIsAddDialogOpen(false), onTokenAdded: handleTokenAdded }), _jsx(Dialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirm Token Deletion" }), _jsxs(DialogDescription, { children: ["Are you sure you want to delete the GitHub token \"", selectedToken?.memorable_name, "\"? This action cannot be undone."] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsDeleteDialogOpen(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: confirmDelete, disabled: isLoading, children: isLoading ? 'Deleting...' : 'Delete Token' })] })] }) })] }));
}
