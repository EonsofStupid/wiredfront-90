import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface UserMenuItemsProps {
  user: any | null;
  onLogout: () => Promise<void>;
}

export const UserMenuItems = ({ user, onLogout }: UserMenuItemsProps) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const { data: roleData, error } = await supabase
            .from('profiles')
            .select('role_id')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            setUserRole('visitor');
            return;
          }

          if (roleData?.role_id) {
            // Get role name from roles table
            const { data: roleName, error: roleError } = await supabase
              .from('roles')
              .select('name')
              .eq('id', roleData.role_id)
              .single();

            if (roleError) {
              console.error('Error fetching role name:', roleError);
              setUserRole('visitor');
              return;
            }

            setUserRole(roleName?.name || 'visitor');
          } else {
            setUserRole('visitor');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('visitor');
        }
      }
    };

    fetchUserRole();
  }, [user]);

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
            {userRole || 'Loading...'}
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