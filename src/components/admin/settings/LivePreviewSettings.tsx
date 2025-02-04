import { Switch } from "@/components/ui/switch";
import { SettingsContainer } from "./layout/SettingsContainer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  if (status === 'active') {
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
  if (status === 'error') {
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
  return <Loader2 className="h-4 w-4 animate-spin" />;
};

interface LogEntryProps {
  type: 'success' | 'info' | 'error';
  message: string;
}

const LogEntry = ({ type, message }: LogEntryProps) => {
  const iconMap = {
    success: <CheckCircle className="h-4 w-4 text-green-500" />,
    info: <Loader2 className="h-4 w-4 text-blue-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {iconMap[type]}
      <span>{message}</span>
    </div>
  );
};

export function LivePreviewSettings() {
  const { preferences, updatePreferences } = useSettingsStore();
  const livePreviewEnabled = preferences?.livePreview?.enabled || false;

  const handleToggleLivePreview = async (enabled: boolean) => {
    updatePreferences({ 
      livePreview: { 
        ...preferences?.livePreview,
        enabled 
      } 
    });

    try {
      const { error } = await supabase
        .from('live_preview_status')
        .upsert({ 
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: enabled ? 'initializing' : 'inactive',
          current_step: enabled ? 'Starting initialization...' : null,
          logs: []
        });

      if (error) throw error;
      toast.success(`Live Preview ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating live preview status:', error);
      updatePreferences({ 
        livePreview: { 
          ...preferences?.livePreview,
          enabled: !enabled 
        } 
      });
      toast.error('Failed to update Live Preview status');
    }
  };

  return (
    <SettingsContainer
      title="Live Preview"
      description="Configure how code changes are previewed in real-time"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Enable Live Preview</h3>
            <p className="text-sm text-muted-foreground">
              See your code changes in real-time as they happen
            </p>
          </div>
          <Switch
            checked={livePreviewEnabled}
            onCheckedChange={handleToggleLivePreview}
          />
        </div>

        {livePreviewEnabled && (
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <StatusIndicator status="active" />
              <span className="text-sm font-medium">Preview Status</span>
            </div>

            <Progress value={100} className="h-2" />

            <ScrollArea className="h-32 rounded-md border">
              <div className="p-4 space-y-2">
                <LogEntry
                  type="success"
                  message="Live Preview initialized successfully"
                />
                <LogEntry
                  type="info"
                  message="Watching for file changes..."
                />
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </SettingsContainer>
  );
}