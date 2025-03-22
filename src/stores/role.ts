import { create } from 'zustand';

export type Role = 'super_admin' | 'admin' | 'developer' | 'subscriber' | 'guest';

interface RoleState {
  roles: Role[];
  hasRole: (role: Role) => boolean;
  setRoles: (roles: Role[]) => void;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  hasRole: (role: Role) => get().roles.includes(role),
  setRoles: (roles: Role[]) => set({ roles }),
}));
