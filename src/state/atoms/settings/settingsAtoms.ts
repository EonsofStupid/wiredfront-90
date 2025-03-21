import { atom } from 'jotai';
import { useSettingsStore } from '../../stores/settings/settingsStore';
import { SettingsSection } from '../../types/settings';

// Store Atom
export const settingsStoreAtom = atom(() => useSettingsStore.getState());

// UI State Atoms
export const settingsActiveSectionAtom = atom<string | null>(null);
export const settingsIsOpenAtom = atom<boolean>(false);

// Derived Atoms
export const settingsVisibleSectionsAtom = atom<SettingsSection[]>((get) => {
  const store = get(settingsStoreAtom);
  return Object.values(store.sections).filter((section) => section.isEnabled);
});

export const settingsCurrentSectionAtom = atom<SettingsSection | null>((get) => {
  const activeSection = get(settingsActiveSectionAtom);
  const store = get(settingsStoreAtom);
  return activeSection ? store.sections[activeSection] || null : null;
});

// Computed Atoms
export const settingsNavigationItemsAtom = atom((get) => {
  const sections = get(settingsVisibleSectionsAtom);
  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    icon: section.icon,
    isActive: section.id === get(settingsActiveSectionAtom),
  }));
});
