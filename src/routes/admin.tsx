import { Route } from 'react-router-dom';

// Admin components
import AdminDashboard from '@/pages/admin/AdminDashboard';
import FeatureFlagsPage from '@/pages/admin/FeatureFlagsPage';
import MetricsOverview from '@/pages/admin/MetricsOverview';
import NavigationLogsPage from '@/pages/admin/NavigationLogs';
import SystemLogsPage from '@/pages/admin/SystemLogs';

// Admin settings components
import { APISettings } from '@/components/admin/settings/APISettings';
import { AccessibilitySettings } from '@/components/admin/settings/AccessibilitySettings';
import { ChatFeatureSettings } from '@/components/admin/settings/ChatFeatureSettings';
import { ChatSettings } from '@/components/admin/settings/ChatSettings';
import { EnhancedSystemSettingsPanel } from '@/components/admin/settings/EnhancedSystemSettingsPanel';
import { LivePreviewSettings } from '@/components/admin/settings/LivePreviewSettings';
import { NotificationSettings } from '@/components/admin/settings/NotificationSettings';
import { APIKeyManagement } from '@/components/admin/settings/api/APIKeyManagement';
import { RAGKeysSettings } from '@/components/admin/settings/api/RAGKeysSettings';

// Admin management panels
import { UsageMonitoringPanel } from '@/components/admin/analytics/UsageMonitoringPanel';
import { CustomerManagementPanel } from '@/components/admin/customers/CustomerManagementPanel';
import { FeatureManagementPanel } from '@/components/admin/features/FeatureManagementPanel';
import { SubscriptionManagementPanel } from '@/components/admin/subscriptions/SubscriptionManagementPanel';

// Route paths
export const ADMIN_ROUTES = [
  '/admin',
  '/admin/dashboard',
  '/admin/metrics-overview',
  '/admin/settings/api',
  '/admin/settings/accessibility',
  '/admin/settings/notifications',
  '/admin/settings/general',
  '/admin/settings/chat',
  '/admin/settings/chat-features',
  '/admin/settings/live-preview',
  '/admin/settings/feature-flags',
  '/admin/users',
  '/admin/customers',
  '/admin/feature-management',
  '/admin/usage-analytics',
  '/admin/subscriptions',
  '/admin/logs/system',
  '/admin/logs/navigation'
];

export const adminRoutes = (
  <>
    <Route path="/admin" element={<MetricsOverview />} />
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/metrics-overview" element={<MetricsOverview />} />

    {/* Settings Routes */}
    <Route path="/admin/settings/api" element={<APISettings />} />
    <Route path="/admin/settings/accessibility" element={<AccessibilitySettings />} />
    <Route path="/admin/settings/notifications" element={<NotificationSettings />} />
    <Route path="/admin/settings/general" element={<EnhancedSystemSettingsPanel />} />
    <Route path="/admin/settings/chat" element={<ChatSettings />} />
    <Route path="/admin/settings/chat-features" element={<ChatFeatureSettings />} />
    <Route path="/admin/settings/live-preview" element={<LivePreviewSettings />} />
    <Route path="/admin/settings/feature-flags" element={<FeatureFlagsPage />} />

    {/* Management Routes */}
    <Route path="/admin/customers" element={<CustomerManagementPanel />} />
    <Route path="/admin/feature-management" element={<FeatureManagementPanel />} />
    <Route path="/admin/usage-analytics" element={<UsageMonitoringPanel />} />
    <Route path="/admin/subscriptions" element={<SubscriptionManagementPanel />} />

    {/* API Routes */}
    <Route path="/admin/api-keys" element={<APIKeyManagement />} />
    <Route path="/admin/rag-settings" element={<RAGKeysSettings />} />

    {/* Log Routes */}
    <Route path="/admin/logs/system" element={<SystemLogsPage />} />
    <Route path="/admin/logs/navigation" element={<NavigationLogsPage />} />

    {/* Placeholder Routes */}
    <Route path="/admin/prompt-enhancements" element={<div>Prompt Enhancement Management</div>} />
    <Route path="/admin/projects" element={<div>Project Management</div>} />
    <Route path="/admin/models" element={<div>Models Configuration</div>} />
    <Route path="/admin/queues" element={<div>Queue Management</div>} />
    <Route path="/admin/cache" element={<div>Cache Control</div>} />
    <Route path="/admin/activity" element={<div>Activity Logs</div>} />
    <Route path="/admin/database" element={<div>Database Management</div>} />
    <Route path="/admin/search" element={<div>Admin Search</div>} />
    <Route path="/admin/notifications" element={<div>Admin Notifications</div>} />
    <Route path="/admin/github-connections" element={<div>GitHub Connections</div>} />
  </>
);
