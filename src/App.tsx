import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Chat } from "./components/chat";
import { AppLayout } from "./components/layout/AppLayout";
import { MainLayout } from "./components/layout/MainLayout";
import "./styles/debug.css";
import { setupZIndexVars } from "./styles/setup/injectZIndexVars";
import { enableZIndexDebug } from "./utils/debug";

// Import your page components here
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Editor from "./pages/Editor";
import Index from "./pages/Index";
import Settings from "./pages/Settings";

function App() {
  // Initialize z-index CSS variables and debug mode
  useEffect(() => {
    setupZIndexVars();
    enableZIndexDebug();
    console.log("Z-index CSS variables injected and debug mode enabled");
  }, []);

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            }
          />
          <Route
            path="/documents"
            element={
              <MainLayout>
                <Documents />
              </MainLayout>
            }
          />
          <Route
            path="/editor"
            element={
              <MainLayout>
                <Editor />
              </MainLayout>
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </AppLayout>
      <Chat />
    </>
  );
}

export default App;
