import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

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
      // First get the role_id from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profileData?.role_id) {
        // Then get the role name from roles table
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('name')
          .eq('id', profileData.role_id)
          .single();

        if (roleError) throw roleError;

        const roles = roleData ? [roleData.name] : ['visitor'];
        console.log('Fetched roles:', roles); // Debug log
        set({ roles, isLoading: false });
      } else {
        set({ roles: ['visitor'], isLoading: false });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user roles';
      set({ error: message, isLoading: false, roles: ['visitor'] });
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
    console.log('Current roles:', roles, 'Checking for:', role); // Debug log
    return roles.includes(role);
  },
}));