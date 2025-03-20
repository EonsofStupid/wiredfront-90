import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Component, useState, useCallback } from 'react';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
class ErrorBoundaryComponent extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "resetErrorBoundary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
                if (this.props.onReset) {
                    this.props.onReset();
                }
            }
        });
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        logger.error('Error caught by boundary', {
            error: error.message,
            stack: error.stack,
            component: errorInfo.componentStack
        });
        this.setState({
            errorInfo
        });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            if (React.isValidElement(this.props.fallback)) {
                return React.cloneElement(this.props.fallback, {
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                    resetErrorBoundary: this.resetErrorBoundary
                });
            }
            return this.props.fallback;
        }
        return this.props.children;
    }
}
export const DefaultErrorFallback = ({ error, resetErrorBoundary }) => {
    return (_jsxs("div", { className: "p-4 border border-destructive/50 rounded-md bg-destructive/10", children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Something went wrong" }), error && (_jsx("p", { className: "text-xs text-muted-foreground mb-3", children: error.message })), resetErrorBoundary && (_jsx("button", { onClick: resetErrorBoundary, className: "text-xs px-2 py-1 bg-primary/80 text-primary-foreground rounded hover:bg-primary transition-colors", children: "Try again" }))] }));
};
export function useErrorBoundary() {
    const [key, setKey] = useState(0);
    const resetBoundary = useCallback(() => {
        setKey(prev => prev + 1);
        toast.success('Component recovered successfully');
        logger.info('Error boundary reset', { timestamp: new Date().toISOString() });
    }, []);
    return {
        ErrorBoundary: ErrorBoundaryComponent,
        DefaultErrorFallback,
        resetBoundary,
        boundaryKey: key
    };
}
