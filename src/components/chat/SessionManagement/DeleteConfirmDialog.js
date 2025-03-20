import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Delete", destructive = false }) {
    return (_jsx(AlertDialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(AlertDialogContent, { className: "chat-glass-card border-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20", children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: title }), _jsx(AlertDialogDescription, { children: description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { className: "border-white/10 hover:bg-white/10", children: "Cancel" }), _jsxs(AlertDialogAction, { onClick: onConfirm, className: `${destructive
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-primary"}`, children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), confirmLabel] })] })] }) }));
}
