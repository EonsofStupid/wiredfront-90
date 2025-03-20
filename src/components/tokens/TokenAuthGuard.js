import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuthStore } from '@/stores/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
export function TokenAuthGuard({ children, fallback }) {
    const { user, loading } = useAuthStore();
    const navigate = useNavigate();
    if (loading) {
        return _jsx("div", { className: "animate-pulse h-4 w-24 bg-muted rounded" });
    }
    if (!user) {
        if (fallback) {
            return _jsx(_Fragment, { children: fallback });
        }
        return (_jsxs(Alert, { children: [_jsx(AlertTitle, { children: "Authentication Required" }), _jsxs(AlertDescription, { children: [_jsx("p", { className: "mb-2", children: "You need to be logged in to view token information." }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => navigate('/login'), children: "Log In" })] })] }));
    }
    return _jsx(_Fragment, { children: children });
}
