import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { UserMenuItems } from "./UserMenuItems";
import { UserMenuTrigger } from "./UserMenuTrigger";
import { useAuthStore } from "@/stores/auth";
import { NavigationService } from "@/services/navigation/NavigationService";
import styles from "./styles/UserMenu.module.css";
export const UserMenu = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const handleLogout = async () => {
        try {
            await logout();
            NavigationService.navigate(navigate, '/login');
            toast.success('Successfully logged out');
        }
        catch (error) {
            toast.error('Error logging out');
        }
    };
    return (_jsx("div", { className: styles.userMenuContainer, style: { zIndex: 'var(--z-user-menu)' }, children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(UserMenuTrigger, { className: styles.userMenuTrigger }) }), _jsx(DropdownMenuContent, { align: "end", className: `glass-card w-56 ${styles.userMenuContent}`, sideOffset: 8, alignOffset: 0, children: _jsx(UserMenuItems, { user: user, onLogout: handleLogout }) })] }) }));
};
