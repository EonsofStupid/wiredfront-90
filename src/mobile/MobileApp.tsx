
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MobileLayout } from "./layout/MobileLayout";
import { MobileHome } from "./screens/MobileHome";
import { MobileEditor } from "./screens/MobileEditor";
import { MobileSettings } from "./screens/MobileSettings";
import { MobileDocuments } from "./screens/MobileDocuments";
import { MobileChat } from "./components/chat/MobileChat";

/**
 * Primary mobile application component that handles routing
 * and wraps all routes in the mobile-specific layout
 */
export const MobileApp = () => {
  const location = useLocation();
  
  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<MobileHome />} />
        <Route path="/editor" element={<MobileEditor />} />
        <Route path="/documents" element={<MobileDocuments />} />
        <Route path="/settings" element={<MobileSettings />} />
      </Routes>
      
      {/* Always render chat but conditionally show it */}
      <MobileChat />
    </MobileLayout>
  );
};
