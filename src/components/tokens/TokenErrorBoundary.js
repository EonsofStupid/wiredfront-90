import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class TokenErrorBoundary extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "resetError", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: null });
            }
        });
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
        console.error("Token component error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallbackComponent) {
                const FallbackComponent = this.props.fallbackComponent;
                return _jsx(FallbackComponent, { error: this.state.error, resetError: this.resetError });
            }
            return (_jsxs("div", { className: "p-4 border border-red-200 rounded-md bg-red-50 text-red-800", children: [_jsx("h3", { className: "font-medium mb-2", children: "Token System Error" }), _jsx("p", { className: "text-sm mb-4", children: this.state.error.message }), _jsx("button", { onClick: this.resetError, className: "px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm", children: "Retry" })] }));
        }
        return this.props.children;
    }
}
// Create a component wrapper with error boundary for token-related components
export function withTokenErrorBoundary(Component) {
    return function TokenErrorBoundaryWrapper(props) {
        return (_jsx(TokenErrorBoundary, { children: _jsx(Component, { ...props }) }));
    };
}
