
import { Card } from "@/components/ui/card";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";
import { APIKeyCardHeader } from "./APIKeyCardHeader";
import { APIKeyCardContent } from "./APIKeyCardContent";
import { APIKeyCardFooter } from "./APIKeyCardFooter";

interface APIKeyCardProps {
  config: APIConfiguration;
  onValidate: (configId: string) => Promise<boolean>;
  onDelete: (configId: string) => Promise<boolean>;
  onRefresh: () => void;
}

export function APIKeyCard({ 
  config, 
  onValidate, 
  onDelete, 
  onRefresh 
}: APIKeyCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-200 ${!config.is_enabled ? 'opacity-70' : ''}`}>
      <APIKeyCardHeader 
        config={config} 
        onValidate={onValidate} 
        onDelete={onDelete} 
        onRefresh={onRefresh} 
      />
      <APIKeyCardContent config={config} />
      <APIKeyCardFooter lastValidated={config.last_validated} />
    </Card>
  );
}
