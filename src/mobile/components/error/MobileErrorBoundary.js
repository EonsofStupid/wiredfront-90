import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ErrorBoundary as BaseErrorBoundary } from "@/components/error/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
const MobileErrorFallback = ({ error, resetErrorBoundary }) => {
    return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen p-6 bg-dark text-white", children: _jsx("div", { className: "w-full max-w-md mobile-glass-card", children: _jsxs("div", { className: "flex flex-col items-center space-y-4 p-4", children: [_jsx(AlertTriangle, { className: "h-12 w-12 text-neon-pink" }), _jsx("h2", { className: "text-xl font-bold text-center", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-center opacity-80", children: error.message || "An unexpected error occurred in the mobile app" }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { onClick: resetErrorBoundary, className: "mobile-button", children: "Try again" }), _jsx(Button, { onClick: () => window.location.reload(), className: "mobile-button-outline", children: "Reload app" })] })] }) }) }));
};
export const MobileErrorBoundary = ({ children }) => {
    return (_jsx(BaseErrorBoundary, { FallbackComponent: MobileErrorFallback, onReset: () => {
            // When the error boundary resets, we could perform additional cleanup
            console.log("Mobile error boundary reset");
        }, children: children }));
};
