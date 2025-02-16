
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleStore } from "@/stores/role";
import { toast } from "sonner";

interface AdminRoleCheckProps {
  children: React.ReactNode;
}

export const AdminRoleCheck = ({ children }: AdminRoleCheckProps) => {
  const navigate = useNavigate();
  const { roles, refreshRoles } = useRoleStore();

  useEffect(() => {
    const checkAdminAccess = async () => {
      await refreshRoles();
      
      const isAdmin = roles.some(role => 
        ['admin', 'super_admin'].includes(role.toLowerCase())
      );

      if (!isAdmin) {
        toast.error("You don't have permission to access this area");
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [roles, navigate, refreshRoles]);

  return <>{children}</>;
};
