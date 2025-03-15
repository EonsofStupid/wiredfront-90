
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRoleStore, getRoleDisplayName } from "@/stores/role";
import { LayoutDashboard, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./styles/UserMenu.module.css";
import { NavigationService } from "@/services/navigation/NavigationService";

interface UserMenuItemsProps {
  user: any | null;
  onLogout: () => Promise<void>;
}

export const UserMenuItems = ({ user, onLogout }: UserMenuItemsProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles, checkUserRole } = useRoleStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      if (user?.id) {
        try {
          await checkUserRole(user.id);
        } catch (error) {
          console.error('Error loading user role:', error);
          toast.error('Failed to load user role');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadUserRole();
  }, [user, checkUserRole]);

  if (!user) {
    return (
      <DropdownMenuItem 
        onClick={() => NavigationService.navigate(navigate, '/login')}
        className={styles.menuItem}
      >
        Login
      </DropdownMenuItem>
    );
  }

  const isAdmin = roles.some(role => ['admin', 'super_admin'].includes(role.toLowerCase()));
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <>
      <DropdownMenuLabel className={`font-normal ${styles.userMenuLabel}`}>
        <div className="flex flex-col space-y-1">
          <p 
            className={`text-sm font-medium leading-none ${styles.cyberEmail}`} 
            data-text={user.email}
          >
            {user.email}
          </p>
          <p className={`text-xs leading-none ${styles.cyberRole}`}>
            {isLoading ? 'Loading...' : getRoleDisplayName(roles[0] || 'guest')}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className={cn(
          `cursor-pointer flex items-center gap-2 ${styles.menuItem}`,
          isCurrentPath('/dashboard') && `${styles.menuItemActive}`
        )}
        onClick={() => NavigationService.navigate(navigate, '/dashboard')}
        data-text="Dashboard"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className={styles.glitchText} data-text="Dashboard">Dashboard</span>
      </DropdownMenuItem>
      <DropdownMenuItem 
        className={cn(
          `cursor-pointer flex items-center gap-2 ${styles.menuItem}`,
          isCurrentPath('/settings') && `${styles.menuItemActive}`
        )}
        onClick={() => NavigationService.navigate(navigate, '/settings')}
        data-text="Settings"
      >
        <Settings className="h-4 w-4" />
        <span className={styles.glitchText} data-text="Settings">Settings</span>
      </DropdownMenuItem>
      {isAdmin && (
        <DropdownMenuItem 
          className={cn(
            `cursor-pointer flex items-center gap-2 ${styles.menuItem} ${styles.adminMenuItem}`,
            location.pathname.startsWith('/admin') && `${styles.menuItemActive}`
          )}
          onClick={() => NavigationService.navigate(navigate, '/admin')}
          data-text="Admin Dashboard"
        >
          <Shield className="h-4 w-4" />
          <span className={styles.glitchText} data-text="Admin Dashboard">Admin Dashboard</span>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className={`cursor-pointer ${styles.menuItem} ${styles.logoutMenuItem}`}
        onClick={onLogout}
        data-text="Logout"
      >
        <span className={styles.glitchText} data-text="Logout">Logout</span>
      </DropdownMenuItem>
    </>
  );
};
