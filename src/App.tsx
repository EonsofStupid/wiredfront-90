import { GuestCTA } from "@/components/auth/GuestCTA";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import MobileExperience from "./mobile";
import { AppRoutes, PUBLIC_ROUTES } from "./routes";
import { ADMIN_ROUTES } from "./routes/admin";
import { RouteLoggingService } from "./services/navigation/RouteLoggingService";

const App = () => {
  const { isMobile } = useIsMobile();
  const { user, isAuthenticated, initializeAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
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
      <ChatProvider>
        <MobileExperience />
        <Toaster position="top-center" />
      </ChatProvider>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));

  return (
    <ChatProvider>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        isPublicRoute={isPublicRoute}
        isAdminRoute={isAdminRoute}
      />
      <DraggableChat />
      <GuestCTA />
      <Toaster />
    </ChatProvider>
  );
};

export default App;
