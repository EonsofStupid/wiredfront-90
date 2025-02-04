import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RoleState {
  roles: string[];
  isLoading: boolean;
  error: string | null;
  checkUserRole: (userId: string) => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  isLoading: false,
  error: null,
  checkUserRole: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;

      set({ roles: data.map(r => r.role), isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user roles';
      set({ error: message, isLoading: false });
      toast.error('Failed to load user roles');
    }
  },
  hasRole: (role: string) => {
    return get().roles.includes(role);
  },
}));