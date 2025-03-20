import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRoleStore, getRoleDisplayName } from "@/stores/role";
import { LayoutDashboard, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./styles/UserMenu.module.css";
import { NavigationService } from "@/services/navigation/NavigationService";
export const UserMenuItems = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { roles, checkUserRole } = useRoleStore();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadUserRole = async () => {
            if (user?.id) {
                try {
                    await checkUserRole(user.id);
                }
                catch (error) {
                    console.error('Error loading user role:', error);
                    toast.error('Failed to load user role');
                }
                finally {
                    setIsLoading(false);
                }
            }
        };
        loadUserRole();
    }, [user, checkUserRole]);
    if (!user) {
        return (_jsx(DropdownMenuItem, { onClick: () => NavigationService.navigate(navigate, '/login'), className: styles.menuItem, children: "Login" }));
    }
    const isAdmin = roles.some(role => ['admin', 'super_admin'].includes(role.toLowerCase()));
    const isCurrentPath = (path) => location.pathname === path;
    return (_jsxs(_Fragment, { children: [_jsx(DropdownMenuLabel, { className: `font-normal ${styles.userMenuLabel}`, children: _jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("p", { className: `text-sm font-medium leading-none ${styles.cyberEmail}`, "data-text": user.email, children: user.email }), _jsx("p", { className: `text-xs leading-none ${styles.cyberRole}`, children: isLoading ? 'Loading...' : getRoleDisplayName(roles[0] || 'guest') })] }) }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: cn(`cursor-pointer flex items-center gap-2 ${styles.menuItem}`, isCurrentPath('/dashboard') && `${styles.menuItemActive}`), onClick: () => NavigationService.navigate(navigate, '/dashboard'), "data-text": "Dashboard", children: [_jsx(LayoutDashboard, { className: "h-4 w-4" }), _jsx("span", { className: styles.glitchText, "data-text": "Dashboard", children: "Dashboard" })] }), _jsxs(DropdownMenuItem, { className: cn(`cursor-pointer flex items-center gap-2 ${styles.menuItem}`, isCurrentPath('/settings') && `${styles.menuItemActive}`), onClick: () => NavigationService.navigate(navigate, '/settings'), "data-text": "Settings", children: [_jsx(Settings, { className: "h-4 w-4" }), _jsx("span", { className: styles.glitchText, "data-text": "Settings", children: "Settings" })] }), isAdmin && (_jsxs(DropdownMenuItem, { className: cn(`cursor-pointer flex items-center gap-2 ${styles.menuItem} ${styles.adminMenuItem}`, location.pathname.startsWith('/admin') && `${styles.menuItemActive}`), onClick: () => NavigationService.navigate(navigate, '/admin'), "data-text": "Admin Dashboard", children: [_jsx(Shield, { className: "h-4 w-4" }), _jsx("span", { className: styles.glitchText, "data-text": "Admin Dashboard", children: "Admin Dashboard" })] })), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { className: `cursor-pointer ${styles.menuItem} ${styles.logoutMenuItem}`, onClick: onLogout, "data-text": "Logout", children: _jsx("span", { className: styles.glitchText, "data-text": "Logout", children: "Logout" }) })] }));
};
