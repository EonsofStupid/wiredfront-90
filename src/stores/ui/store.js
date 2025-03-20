import { create } from 'zustand';
const initialState = {
    theme: 'dark',
    sidebarOpen: false,
    activePanel: null
};
export const useUIStore = create((set) => ({
    ...initialState,
    setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        }
    },
    toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
    },
    setActivePanel: (panelId) => {
        set({ activePanel: panelId });
    }
}));
// Selector hooks
export const useTheme = () => useUIStore(state => state.theme);
export const useSidebarState = () => useUIStore(state => state.sidebarOpen);
export const useActivePanel = () => useUIStore(state => state.activePanel);
