import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenuItems } from "./UserMenuItems";
import { UserMenuTrigger } from "./UserMenuTrigger";
import { useAuthStore } from "@/stores/auth/store";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="relative z-[100]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserMenuTrigger />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="glass-card z-[100]"
          style={{ position: 'relative', zIndex: 100 }}
        >
          <UserMenuItems user={user} onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};