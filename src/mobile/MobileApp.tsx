import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { MobileLayout } from "./layout/MobileLayout";
import { MobileHome } from "./screens/MobileHome";
import { MobileEditor } from "./screens/MobileEditor";
import { MobileSettings } from "./screens/MobileSettings";
import { MobileDocuments } from "./screens/MobileDocuments";
import { MobileChat } from "./components/chat/MobileChat";
import { MobileErrorBoundary } from "./components/error/MobileErrorBoundary";
import { MobileGitHubCallback } from "./screens/MobileGitHubCallback";
import { toast } from "sonner";
import { useGitHubConnection } from '@/components/features/github/hooks/useGitHubConnection';

/**
 * Primary mobile application component that handles routing
 * and wraps all routes in the mobile-specific layout
 */
export const MobileApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkConnectionStatus } = useGitHubConnection();
  
  // Handle any route change errors globally
  const handleError = (error: Error) => {
    console.error("Mobile app navigation error:", error);
    toast.error("Navigation error: " + error.message);
  };
  
  // Handle GitHub callback and other special routes
  useEffect(() => {
    // If we're on the GitHub callback page, verify connection after rendering
    if (location.pathname === "/github-callback") {
      // The callback page will handle the GitHub authentication
      setTimeout(() => {
        checkConnectionStatus();
      }, 1000);
    }
  }, [location.pathname, checkConnectionStatus]);
  
  return (
    <MobileErrorBoundary>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/editor" element={<MobileEditor />} />
          <Route path="/documents" element={<MobileDocuments />} />
          <Route path="/settings" element={<MobileSettings />} />
          <Route path="/github-callback" element={<MobileGitHubCallback />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-lg font-medium text-neon-pink">Page Not Found</h2>
              <p className="text-sm text-white/70 mt-2">The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
        
        {/* Always render chat but conditionally show it */}
        <MobileChat />
      </MobileLayout>
    </MobileErrorBoundary>
  );
};
