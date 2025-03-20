import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/chat/LoggingService';
import { toast } from 'sonner';
import { create } from 'zustand';
export const useRoleStore = create((set, get) => ({
    roles: [],
    isLoading: false,
    error: null,
    checkUserRole: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();
            if (roleError) {
                console.error('Error fetching user role:', roleError);
                logger.error('Error fetching user role:', roleError);
                // Set as guest for failed queries
                set({ roles: ['guest'], isLoading: false });
                return;
            }
            if (roleData?.role) {
                // Validate that the role is a valid AppRole
                const role = roleData.role.toLowerCase();
                // Check if the role is valid against our AppRole type
                const validRoles = ['super_admin', 'admin', 'developer', 'subscriber', 'guest'];
                if (validRoles.includes(role)) {
                    set({ roles: [role], isLoading: false });
                }
                else {
                    logger.warn(`Invalid role found: ${role}, defaulting to guest`);
                    set({ roles: ['guest'], isLoading: false });
                }
                return;
            }
            // If no role found, set as guest
            set({ roles: ['guest'], isLoading: false });
        }
        catch (error) {
            console.error('Error fetching user role:', error);
            logger.error('Error fetching user role:', error);
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
        else {
            set({ roles: ['guest'] });
        }
    },
    hasRole: (role) => {
        const roles = get().roles;
        return roles.some(r => r.toLowerCase() === role.toLowerCase());
    },
}));
// Helper function to convert internal role names to display names
export const getRoleDisplayName = (role) => {
    const displayNames = {
        'super_admin': 'Super Administrator',
        'admin': 'Administrator',
        'developer': 'Developer',
        'subscriber': 'Subscriber',
        'guest': 'Guest'
    };
    return displayNames[role.toLowerCase()] || role;
};
