import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/button";
/**
 * Mobile slide-in menu component
 */
export const MobileMenu = ({ isOpen, onClose }) => {
    // Add escape key handler
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        // Lock body scroll when menu is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);
    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[var(--mobile-z-index-menu)] bg-black/50 backdrop-blur-sm", onClick: handleBackdropClick, children: _jsxs("div", { className: cn("fixed top-0 left-0 h-full w-4/5 max-w-xs bg-dark-lighter", "border-r border-neon-blue/20 shadow-lg", "transform transition-transform duration-300 ease-in-out", "flex flex-col", isOpen ? "translate-x-0 mobile-slide-in-left" : "-translate-x-full"), children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-neon-blue/20", children: [_jsx("h2", { className: "gradient-text text-xl font-bold", children: "wiredFRONT" }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", onClick: onClose, children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(MobileNavigation, { onItemClick: onClose }) })] }) }));
};
