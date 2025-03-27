
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  settingsOpen: boolean;
  mobileMenuOpen: boolean;
  
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleSettings: () => void;
  toggleMobileMenu: () => void;
  setDarkMode: (active: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      darkMode: true,
      sidebarOpen: true,
      settingsOpen: false,
      mobileMenuOpen: false,
      
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleSettings: () => set((state) => ({ settingsOpen: !state.settingsOpen })),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      
      setDarkMode: (active) => set({ darkMode: active }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
    }),
    { name: 'UIStore' }
  )
);
