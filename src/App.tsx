import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MetricsOverview } from './components/admin/sections/MetricsOverview';
import { UsageMonitoringPanel } from './components/admin/sections/UsageMonitoringPanel';
import { CustomerManagementPanel } from './components/admin/sections/CustomerManagementPanel';
import { FeatureManagementPanel } from './components/admin/sections/FeatureManagementPanel';
import { ProjectManagementPanel } from './components/admin/sections/ProjectManagementPanel';
import { SubscriptionManagementPanel } from './components/admin/sections/SubscriptionManagementPanel';
import { SystemLogs } from './components/admin/sections/SystemLogs';
import { NavigationLogs } from './components/admin/sections/NavigationLogs';
import { TokenManagementPage } from './components/admin/sections/TokenManagementPage';
import { FeatureFlagsPage } from './components/admin/sections/FeatureFlagsPage';
import { VectorDatabasePanel } from './components/admin/sections/VectorDatabasePanel';
import { AdminGitHubManagement } from './components/admin/sections/AdminGitHubManagement';
import { APISettings } from './components/admin/settings/api/APISettings';
import { EnhancedSystemSettingsPanel } from './components/admin/settings/EnhancedSystemSettingsPanel';
import { ChatSettingsTabs } from './components/admin/settings/chat/ChatSettingsTabs';
import { UISettings } from './components/admin/settings/ui/UISettings';
import { LivePreviewSettings } from './components/admin/settings/LivePreview/LivePreviewSettings';
import { NotificationSettings } from './components/admin/settings/NotificationSettings';
import { AccessibilitySettings } from './components/admin/settings/AccessibilitySettings';
import { TokenControlPanel } from './components/admin/sections/TokenControlPanel';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';
import PrivateRoute from './components/PrivateRoute';
import { ChatClient } from './components/chat/chatbridge/ChatClient';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="metrics" element={<MetricsOverview />} />
            <Route
              path="usage-monitoring"
              element={<UsageMonitoringPanel />}
            />
            <Route
              path="customer-management"
              element={<CustomerManagementPanel />}
            />
            <Route
              path="feature-management"
              element={<FeatureManagementPanel />}
            />
            <Route
              path="project-management"
              element={<ProjectManagementPanel />}
            />
            <Route
              path="subscription-management"
              element={<SubscriptionManagementPanel />}
            />
            <Route path="system-logs" element={<SystemLogs />} />
            <Route path="navigation-logs" element={<NavigationLogs />} />
            <Route
              path="token-management"
              element={<TokenManagementPage />}
            />
            <Route path="feature-flags" element={<FeatureFlagsPage />} />
            <Route
              path="vector-database"
              element={<VectorDatabasePanel />}
            />
            <Route
              path="github-connections"
              element={<AdminGitHubManagement />}
            />
            <Route path="api-settings" element={<APISettings />} />
            <Route
              path="/admin/settings/general"
              element={<EnhancedSystemSettingsPanel />}
            />
            <Route 
              path="/admin/settings/chat" 
              element={<ChatSettingsTabs 
                activeTab="general"
                setActiveTab={() => {}}
                settings={{}}
                handleSettingChange={() => {}}
                isSaving={false}
                onSave={() => {}}
              />} 
            />
            <Route
              path="/admin/settings/chat-features"
              element={<UISettings 
                settings={{}}
                handleSettingChange={() => {}}
              />}
            />
            <Route
              path="/admin/settings/live-preview"
              element={<LivePreviewSettings />}
            />
            <Route
              path="/admin/settings/notifications"
              element={<NotificationSettings />}
            />
            <Route
              path="/admin/settings/accessibility"
              element={<AccessibilitySettings />}
            />
            <Route
              path="/admin/rag"
              element={<div>RAG Management</div>}
            />
            <Route
              path="/admin/logs"
              element={<div>Logs Management</div>}
            />
            <Route
              path="/admin/users"
              element={<div>User Management</div>}
            />
            <Route
              path="/admin/projects"
              element={<div>Project Management</div>}
            />
            <Route 
              path="/admin/chat-settings" 
              element={<ChatSettingsTabs 
                activeTab="general"
                setActiveTab={() => {}}
                settings={{}}
                handleSettingChange={() => {}}
                isSaving={false}
                onSave={() => {}}
              />} 
            />
            <Route
              path="/admin/models"
              element={<div>Models Configuration</div>}
            />
            <Route
              path="/admin/tokens"
              element={<TokenControlPanel />}
            />
          </Route>
        </Routes>
      </AuthProvider>
      <ChatClient />
    </Router>
  );
}

export default App;
