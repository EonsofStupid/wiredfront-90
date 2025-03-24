import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationService } from "@/services/navigation/NavigationService";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "./styles/UserMenu.module.css";
import { UserMenuItems } from "./UserMenuItems";
import { UserMenuTrigger } from "./UserMenuTrigger";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      NavigationService.navigate(navigate, "/login");
      toast.success("Successfully logged out");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div
      className={styles.userMenuContainer}
      style={{ zIndex: `var(--z-user-menu)` }}
      data-zlayer={`user-menu (z: var(--z-user-menu))`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserMenuTrigger className={styles.userMenuTrigger} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`glass-card w-56 ${styles.userMenuContent}`}
          sideOffset={8}
          alignOffset={0}
          data-zlayer={`user-menu-dropdown (z: var(--z-dropdown))`}
        >
          <UserMenuItems user={user} onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
