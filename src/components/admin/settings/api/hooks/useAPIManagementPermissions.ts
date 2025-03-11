
import { useRoleStore } from "@/stores/role";

export function useAPIManagementPermissions() {
  const { hasRole } = useRoleStore();
  
  // Determine if user can manage API keys
  const canManageKeys = hasRole('super_admin');
  
  return { canManageKeys };
}
