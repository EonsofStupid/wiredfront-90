
import React from "react";
import { Routes, Route } from "react-router-dom";
import { MobileLayout } from "./layout/MobileLayout";
import { MobileHome } from "./screens/MobileHome";
import { MobileEditor } from "./screens/MobileEditor";
import { MobileSettings } from "./screens/MobileSettings";
import { MobileDocuments } from "./screens/MobileDocuments";
import { MobileChat } from "./components/chat/MobileChat";
import { MobileErrorBoundary } from "./components/error/MobileErrorBoundary";
import { toast } from "sonner";

/**
 * Primary mobile application component that handles routing
 * and wraps all routes in the mobile-specific layout
 */
export const MobileApp = () => {
  // Handle any route change errors globally
  const handleError = (error: Error) => {
    console.error("Mobile app navigation error:", error);
    toast.error("Navigation error: " + error.message);
  };
  
  return (
    <MobileErrorBoundary>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<MobileHome />} />
          <Route path="/editor" element={<MobileEditor />} />
          <Route path="/documents" element={<MobileDocuments />} />
          <Route path="/settings" element={<MobileSettings />} />
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
