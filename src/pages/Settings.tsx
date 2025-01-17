import { SettingsLayout } from "@/components/settings/layout/SettingsLayout";
import { SettingsNavigation } from "@/components/settings/layout/SettingsNavigation";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { AccessibilitySettings } from "@/components/settings/AccessibilitySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { APISettings } from "@/components/settings/APISettings";
import { APIConfigurationPanel } from "@/components/settings/APIConfigurationPanel";
import { ChatSettings } from "@/components/settings/ChatSettings";
import { LivePreviewSettings } from "@/components/settings/LivePreviewSettings";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const settingsTabs = [
    { 
      value: "general", 
      label: "General", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <GeneralSettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "accessibility", 
      label: "Accessibility", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <AccessibilitySettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "notifications", 
      label: "Notifications", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <NotificationSettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "chat", 
      label: "Chat", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <ChatSettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "live-preview", 
      label: "Live Preview", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <LivePreviewSettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "api", 
      label: "API Keys", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <APISettings />
          </Suspense>
        </ErrorBoundary>
      )
    },
    { 
      value: "api-config", 
      label: "API Config", 
      content: (
        <ErrorBoundary>
          <Suspense fallback={<Skeleton className="h-[200px]" />}>
            <APIConfigurationPanel />
          </Suspense>
        </ErrorBoundary>
      )
    },
  ];

  return (
    <ErrorBoundary>
      <SettingsLayout>
        <SettingsNavigation tabs={settingsTabs} defaultValue="general" />
      </SettingsLayout>
    </ErrorBoundary>
  );
};

export default Settings;