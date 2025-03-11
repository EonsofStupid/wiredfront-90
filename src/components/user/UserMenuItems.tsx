
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
      <DropdownMenuItem onClick={() => navigate('/login')}>
        Login
      </DropdownMenuItem>
    );
  }

  const isAdmin = roles.some(role => ['admin', 'super_admin'].includes(role.toLowerCase()));
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.email}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {isLoading ? 'Loading...' : getRoleDisplayName(roles[0] || 'guest')}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className={cn(
          "cursor-pointer flex items-center gap-2",
          isCurrentPath('/dashboard') && "bg-accent text-accent-foreground"
        )}
        onClick={() => navigate('/dashboard')}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </DropdownMenuItem>
      <DropdownMenuItem 
        className={cn(
          "cursor-pointer flex items-center gap-2",
          isCurrentPath('/settings') && "bg-accent text-accent-foreground"
        )}
        onClick={() => navigate('/settings')}
      >
        <Settings className="h-4 w-4" />
        Settings
      </DropdownMenuItem>
      {isAdmin && (
        <DropdownMenuItem 
          className={cn(
            "cursor-pointer flex items-center gap-2",
            location.pathname.startsWith('/admin') && "bg-accent text-accent-foreground"
          )}
          onClick={() => navigate('/admin/metrics-overview')}
        >
          <Shield className="h-4 w-4" />
          Admin Dashboard
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="cursor-pointer text-red-500 focus:text-red-500"
        onClick={onLogout}
      >
        Logout
      </DropdownMenuItem>
    </>
  );
};
