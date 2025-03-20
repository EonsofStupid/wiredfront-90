import { useCallback, useEffect } from 'react';
import { useUserChatPreferences } from './useUserChatPreferences';
import { useTheme } from 'next-themes';
export function useChatTheme() {
    const { preferences, updatePreferences } = useUserChatPreferences();
    const { theme, setTheme } = useTheme();
    // Sync theme with user preferences
    useEffect(() => {
        if (preferences?.theme && theme !== preferences.theme) {
            if (preferences.theme === 'system') {
                setTheme('system');
            }
            else {
                setTheme(preferences.theme);
            }
        }
    }, [preferences?.theme, setTheme, theme]);
    // Handle theme changes
    const handleThemeChange = useCallback(async (newTheme) => {
        if (!preferences)
            return;
        // Update local theme first for instant feedback
        setTheme(newTheme);
        // Update user preferences in the database
        await updatePreferences({
            theme: newTheme
        });
    }, [preferences, setTheme, updatePreferences]);
    return {
        currentTheme: theme,
        setTheme: handleThemeChange
    };
}
