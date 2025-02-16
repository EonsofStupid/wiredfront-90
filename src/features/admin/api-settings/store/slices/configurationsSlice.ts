
import { create } from 'zustand';
import { BaseConfiguration } from '../../types/common';

interface ConfigurationsState {
  selectedConfigId: string | null;
  setSelectedConfig: (id: string | null) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  pendingChanges: Partial<BaseConfiguration> | null;
  setPendingChanges: (changes: Partial<BaseConfiguration> | null) => void;
}

export const useConfigurationsStore = create<ConfigurationsState>((set) => ({
  selectedConfigId: null,
  setSelectedConfig: (id) => set({ selectedConfigId: id }),
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  pendingChanges: null,
  setPendingChanges: (changes) => set({ pendingChanges: changes }),
}));
