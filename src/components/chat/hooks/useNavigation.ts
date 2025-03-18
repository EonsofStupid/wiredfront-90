
import { useNavigate, useLocation } from 'react-router-dom';
import { ChatMode as SupabaseChatMode } from '@/integrations/supabase/types/enums';
import { ChatMode as StoreChatMode } from '@/components/chat/store/types/chat-store-types';
import { supabaseModeToStoreMode, storeModeToSupabaseMode } from '@/utils/modeConversion';
import { useChatStore } from '../store/chatStore';

type ModeRoute = {
  mode: SupabaseChatMode;
  route: string;
};

// Map modes to their respective routes
const MODE_ROUTES: ModeRoute[] = [
  { mode: 'dev', route: '/editor' },
  { mode: 'image', route: '/gallery' },
  { mode: 'training', route: '/training' },
  { mode: 'chat', route: '/' }, // Default route for chat mode
];

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMode, setCurrentMode } = useChatStore();
  
  /**
   * Navigate to the appropriate page based on the selected mode
   */
  const navigateByMode = (mode: SupabaseChatMode) => {
    const modeRoute = MODE_ROUTES.find(mr => mr.mode === mode);
    if (modeRoute && location.pathname !== modeRoute.route) {
      navigate(modeRoute.route);
    }
  };
  
  /**
   * Sync the current location with the appropriate mode
   */
  const syncLocationWithMode = () => {
    const currentPath = location.pathname;
    const matchedRoute = MODE_ROUTES.find(mr => mr.route === currentPath);
    
    if (matchedRoute) {
      const storeMode = supabaseModeToStoreMode(matchedRoute.mode);
      if (storeMode !== currentMode) {
        setCurrentMode(storeMode);
      }
    }
  };
  
  /**
   * Get the route path for a given mode
   */
  const getRouteForMode = (mode: StoreChatMode): string => {
    const supabaseMode = storeModeToSupabaseMode(mode);
    const modeRoute = MODE_ROUTES.find(mr => mr.mode === supabaseMode);
    return modeRoute?.route || '/';
  };
  
  return {
    navigateByMode,
    syncLocationWithMode,
    getRouteForMode,
    currentRoute: location.pathname,
  };
};
