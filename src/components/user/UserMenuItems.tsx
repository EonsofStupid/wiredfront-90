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
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{user.email}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {user.user_metadata?.full_name || 'User'}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => navigate('/profile')}
      >
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => navigate('/settings')}
      >
        Settings
      </DropdownMenuItem>
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