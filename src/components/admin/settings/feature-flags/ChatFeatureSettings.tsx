
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { FeatureKey } from "@/components/chat/store/actions/feature";
import { SettingsContainer } from "../layout/SettingsContainer";

export function ChatFeatureSettings() {
  const { features, toggleFeature, isUpdating } = useFeatureFlags();

  return (
    <SettingsContainer
      title="Chat Features"
      description="Toggle various chat-related features"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="rag-support">RAG Support</Label>
            <p className="text-sm text-muted-foreground">
              Enable Retrieval-Augmented Generation for chat
            </p>
          </div>
          <Switch
            id="rag-support"
            checked={features.ragSupport}
            onCheckedChange={() => toggleFeature('ragSupport')}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="voice-feature">Voice Support</Label>
            <p className="text-sm text-muted-foreground">
              Enable voice input and output for chat
            </p>
          </div>
          <Switch
            id="voice-feature"
            checked={features.voice}
            onCheckedChange={() => toggleFeature('voice')}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="mode-switch">Mode Switching</Label>
            <p className="text-sm text-muted-foreground">
              Allow switching between chat modes (chat, dev, image)
            </p>
          </div>
          <Switch
            id="mode-switch"
            checked={features.modeSwitch}
            onCheckedChange={() => toggleFeature('modeSwitch')}
            disabled={isUpdating}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="token-enforcement">Token Enforcement</Label>
            <p className="text-sm text-muted-foreground">
              Enable token usage limits and tracking
            </p>
          </div>
          <Switch
            id="token-enforcement"
            checked={features.tokenEnforcement}
            onCheckedChange={() => toggleFeature('tokenEnforcement')}
            disabled={isUpdating}
          />
        </div>
      </div>
    </SettingsContainer>
  );
}
