import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
export class GitHubErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false
            }
        });
        Object.defineProperty(this, "resetErrorBoundary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: undefined });
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('GitHub component error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // Default fallback UI if no custom fallback is provided
            const defaultFallback = (_jsxs("div", { className: "p-4 text-center", children: [_jsx(AlertTriangle, { className: "h-8 w-8 text-amber-500 mx-auto mb-2" }), _jsx("h3", { className: "font-medium mb-1", children: "GitHub Tab Error" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "There was an error loading GitHub information." }), _jsxs("div", { className: "flex justify-center space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: this.resetErrorBoundary, className: "text-xs", children: [_jsx(RefreshCw, { className: "h-3 w-3 mr-1" }), "Try Again"] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => window.location.reload(), className: "text-xs", children: "Reload Page" })] })] }));
            return this.props.fallback || defaultFallback;
        }
        return this.props.children;
    }
}
