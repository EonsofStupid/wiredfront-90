
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoleState {
  roles: string[];
  isLoading: boolean;
  error: string | null;
  checkUserRole: (userId: string) => Promise<void>;
  hasRole: (role: string) => boolean;
  refreshRoles: () => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  isLoading: false,
  error: null,

  checkUserRole: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        set({ roles: ['guest'], isLoading: false });
        return;
      }

      if (roleData?.role) {
        set({ roles: [roleData.role.toLowerCase()], isLoading: false });
        return;
      }
      
      // If no role found, set as guest
      set({ roles: ['guest'], isLoading: false });
    } catch (error) {
      console.error('Error fetching user role:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch user roles';
      set({ error: message, isLoading: false, roles: ['guest'] });
      toast.error('Failed to load user roles');
    }
  },

  refreshRoles: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      await get().checkUserRole(session.user.id);
    }
  },

  hasRole: (role: string) => {
    const roles = get().roles;
    return roles.some(r => r.toLowerCase() === role.toLowerCase());
  },
}));

// Helper function to convert internal role names to display names
export const getRoleDisplayName = (role: string): string => {
  const displayNames: Record<string, string> = {
    'super_admin': 'Super Administrator',
    'admin': 'Administrator',
    'developer': 'Developer',
    'subscriber': 'Subscriber',
    'guest': 'Guest'
  };
  return displayNames[role.toLowerCase()] || role;
};
