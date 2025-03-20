import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRoleStore } from '@/stores/role';
import { useAuthStore } from '@/stores/auth';
import { GuestCTA } from './GuestCTA';
export function RoleGate({ children, allowedRoles }) {
    const { roles } = useRoleStore();
    const { isAuthenticated } = useAuthStore();
    // Compare roles exactly as they are stored in the database
    const hasPermission = roles.some(role => allowedRoles.includes(role));
    if (!isAuthenticated) {
        return _jsx(GuestCTA, {});
    }
    if (!hasPermission) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-6 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Access Restricted" }), _jsxs("p", { className: "text-muted-foreground mb-6", children: ["You don't have permission to access this feature.", roles.includes('guest') && " Please upgrade your account to gain access."] })] }));
    }
    return _jsx(_Fragment, { children: children });
}
