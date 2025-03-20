import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useUIStore } from "@/stores";
export const AppLayout = ({ children }) => {
    console.log("AppLayout rendering");
    const theme = useUIStore((state) => state.theme);
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(TooltipProvider, { children: _jsxs("div", { className: `min-h-screen bg-background ${theme}`, children: [_jsx("main", { className: "container mx-auto px-4 py-8", children: children }), _jsx(Toaster, {}), _jsx(Sonner, {})] }) }) }));
};
