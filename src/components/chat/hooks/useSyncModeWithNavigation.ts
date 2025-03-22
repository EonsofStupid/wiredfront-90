import { useChatStore } from '@/stores/chat/chatStore';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useSyncModeWithNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentMode, setCurrentMode } = useChatStore();

  // Sync route to mode
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/chat/')) {
      const newMode = path.split('/chat/')[1];
      if (newMode !== currentMode) {
        setCurrentMode(newMode as any);
      }
    }
  }, [location.pathname, currentMode, setCurrentMode]);

  // Sync mode to route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes('/chat/')) {
      const currentModeFromPath = currentPath.split('/chat/')[1];
      if (currentModeFromPath !== currentMode) {
        navigate(`/chat/${currentMode}`);
      }
    }
  }, [currentMode, location.pathname, navigate]);
};
