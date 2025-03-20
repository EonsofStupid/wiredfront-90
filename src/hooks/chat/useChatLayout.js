import { useJotaiChatLayout } from './useJotaiChatLayout';
import { useJotaiChatDocking } from './useJotaiChatDocking';
/**
 * Combined hook for accessing and managing all chat layout state
 * This provides backward compatibility with the existing useChatLayout API
 */
export function useChatLayout() {
    const layout = useJotaiChatLayout();
    const docking = useJotaiChatDocking();
    return {
        // Layout state
        isMinimized: layout.isMinimized,
        scale: layout.scale,
        showSidebar: layout.showSidebar,
        uiPreferences: layout.uiPreferences,
        // Docking state
        docked: docking.docked,
        position: docking.position,
        dockedItems: docking.dockedItems,
        // Layout actions
        setMinimized: layout.setMinimized,
        toggleMinimized: layout.toggleMinimized,
        setScale: layout.setScale,
        toggleSidebar: layout.toggleSidebar,
        setSidebar: layout.setSidebar,
        // Docking actions
        setDocked: docking.setDocked,
        toggleDocked: docking.toggleDocked,
        setPosition: docking.setPosition,
        setDockedItem: docking.setDockedItem,
        // Enhanced actions
        saveCurrentLayout: layout.saveCurrentLayout,
        resetLayoutWithConfirmation: layout.resetLayoutWithConfirmation,
        setTheme: layout.setTheme,
        setFontSize: layout.setFontSize,
        setUIPreference: layout.setUIPreference,
        saveLayoutToStorage: () => Promise.all([
            layout.saveCurrentLayout(),
            docking.saveCurrentDocking()
        ]).then(() => true).catch(() => false),
        loadLayoutFromStorage: () => Promise.all([
            Promise.resolve(true), // This is already handled in the individual hooks
            Promise.resolve(true)
        ]).then(() => true).catch(() => false),
        resetLayout: async () => {
            await layout.resetLayoutWithConfirmation();
            await docking.resetDockingWithConfirmation();
            return true;
        }
    };
}
export default useChatLayout;
