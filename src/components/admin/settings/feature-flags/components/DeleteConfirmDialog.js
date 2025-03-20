import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
export function DeleteConfirmDialog({ open, onOpenChange, onDelete, flagName }) {
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Are you sure?" }), _jsxs(AlertDialogDescription, { children: ["This will permanently delete the feature flag \"", flagName, "\". This action cannot be undone."] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: "Cancel" }), _jsxs(AlertDialogAction, { onClick: onDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: [_jsx(Trash, { className: "h-4 w-4 mr-2" }), "Delete"] })] })] }) }));
}
