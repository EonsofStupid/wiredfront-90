
import { GuestCTA } from "@/components/auth/GuestCTA";
import { DraggableChat } from "@/features/chat/components/DraggableChat";
import { useSyncModeWithNavigation } from "@/features/chat/hooks/useSyncModeWithNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import MobileExperience from "./mobile";
import { AppRoutes } from "./routes";
import { PUBLIC_ROUTES, ADMIN_ROUTES } from "./routes";
import { RouteLoggingService } from "./services/navigation/RouteLoggingService";

const App = () => {
  const { isMobile } = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize auth from our consolidated auth store
  const { initializeAuth, isAuthenticated, user } = useAuthStore();

  // Sync chat mode with navigation - this handles bidirectional sync
  // between chat mode and the current route
  useSyncModeWithNavigation();

  useEffect(() => {
    // Initialize auth on app load
    const cleanup = initializeAuth();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup().catch(console.error);
      }
    };
  }, [initializeAuth]);

  useEffect(() => {
    const cleanPath = location.pathname + location.search;
    const storedPath = sessionStorage.getItem('currentPath');

    if (storedPath !== cleanPath) {
      RouteLoggingService.logRouteChange(storedPath || 'initial', cleanPath);
      sessionStorage.setItem('currentPath', cleanPath);
    }
  }, [location.pathname, location.search]);

  if (isMobile) {
    return (
      <>
        <MobileExperience />
        <Toaster position="top-center" />
      </>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));

  return (
    <>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        isPublicRoute={isPublicRoute}
        isAdminRoute={isAdminRoute}
      />
      <DraggableChat />
      <GuestCTA />
      <Toaster />
    </>
  );
};

export default App;
