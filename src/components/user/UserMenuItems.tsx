import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserMenuItemsProps {
  user: any | null;
  onLogout: () => Promise<void>;
}

export const UserMenuItems = ({ user, onLogout }: UserMenuItemsProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <DropdownMenuItem onClick={() => navigate('/login')}>
        Login
      </DropdownMenuItem>
    );
  }

  return (
    <>
      <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => navigate('/profile')}>
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/settings')}>
        Settings
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>
        Logout
      </DropdownMenuItem>
    </>
  );
};