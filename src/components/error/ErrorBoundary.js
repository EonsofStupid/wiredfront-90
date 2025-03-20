import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
export class ErrorBoundary extends React.Component {
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
                this.props.onReset?.();
                this.setState({ hasError: false, error: undefined });
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.FallbackComponent) {
                return _jsx(this.props.FallbackComponent, { error: this.state.error || new Error('Unknown error'), resetErrorBoundary: this.resetErrorBoundary });
            }
            return (_jsx("div", { className: "flex items-center justify-center min-h-screen p-4", children: _jsxs(Alert, { variant: "destructive", className: "max-w-md", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Something went wrong" }), _jsx(AlertDescription, { children: this.state.error?.message || 'An unexpected error occurred' }), _jsxs("div", { className: "flex gap-2 mt-4", children: [_jsx(Button, { variant: "outline", onClick: this.resetErrorBoundary, children: "Try Again" }), _jsx(Button, { variant: "outline", onClick: () => window.location.reload(), children: "Reload Page" })] })] }) }));
        }
        return this.props.children;
    }
}
