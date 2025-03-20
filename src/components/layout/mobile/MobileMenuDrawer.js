import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { MobileNavBar } from "./MobileNavBar";
import { Button } from "@/components/ui/button";
export const MobileMenuDrawer = ({ open, onOpenChange }) => {
    return (_jsx(Sheet, { open: open, onOpenChange: onOpenChange, children: _jsxs(SheetContent, { side: "left", className: "w-[85%] max-w-[400px] border-r border-neon-blue/20 bg-dark-lighter/95 backdrop-blur-xl p-0", children: [_jsx(SheetHeader, { className: "p-4 border-b border-neon-blue/20", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(SheetTitle, { className: "gradient-text text-xl font-bold", children: "wiredFRONT" }), _jsx(SheetClose, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "text-neon-pink hover:text-neon-blue", children: _jsx(X, { className: "h-5 w-5" }) }) })] }) }), _jsx(MobileNavBar, {})] }) }));
};
