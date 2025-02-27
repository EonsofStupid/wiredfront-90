
import { useState } from "react";
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent, AdminCardFooter, AdminCardActions } from "@/components/admin/ui/AdminCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Check, AlertCircle, Save, Trash } from "lucide-react";
import { ServiceCardProps } from "@/types/admin/settings/api-configuration";
import { useRoleStore } from "@/stores/role";
import { toast } from "sonner";

export function ServiceCard({
  type,
  title,
  description,
  docsUrl,
  docsText,
  placeholder,
  onSaveConfig,
  isConnecting,
  selectedConfig,
  newConfig,
  onConfigChange,
}: ServiceCardProps) {
  const { hasRole } = useRoleStore();
  const [configStatus, setConfigStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const canEdit = hasRole('admin') || hasRole('super_admin');
  const canDelete = hasRole('super_admin');

  const handleSaveClick = async () => {
    if (!newConfig.name) {
      setError("Configuration name is required");
      toast.error("Configuration name is required");
      return;
    }
    
    if (!newConfig.key) {
      setError("API key is required");
      toast.error("API key is required");
      return;
    }
    
    setConfigStatus('validating');
    setError(null);
    
    try {
      await onSaveConfig(type, newConfig);
      setConfigStatus('success');
      toast.success(`${title} configuration saved successfully`);
      setTimeout(() => setConfigStatus('idle'), 2000);
    } catch (err) {
      setConfigStatus('error');
      const errorMessage = err instanceof Error ? err.message : "Failed to save configuration";
      setError(errorMessage);
      toast.error(`Failed to save ${title} configuration`);
    }
  };

  const handleValidateClick = () => {
    // This would be implemented to validate the API key
    setConfigStatus('validating');
    // Simulating validation
    setTimeout(() => {
      setConfigStatus('success');
      toast.success("API key validated successfully");
      setTimeout(() => setConfigStatus('idle'), 2000);
    }, 1500);
  };

  return (
    <AdminCard 
      className="relative overflow-hidden" 
      requiredRole={isEditing ? "super_admin" : undefined}
      error={error}
    >
      <AdminCardHeader>
        <AdminCardTitle>{title}</AdminCardTitle>
        <AdminCardDescription>{description}</AdminCardDescription>
      </AdminCardHeader>
      <AdminCardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Configuration Name"
            value={newConfig.name}
            onChange={(e) => {
              onConfigChange(type, 'name', e.target.value);
              setError(null);
            }}
            className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 mb-2"
            disabled={!canEdit || isConnecting}
          />
          <Input
            type="password"
            placeholder={placeholder}
            value={newConfig.key}
            onChange={(e) => {
              onConfigChange(type, 'key', e.target.value);
              setError(null);
            }}
            className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
            disabled={!canEdit || isConnecting}
          />
          {type === 'pinecone' && (
            <>
              <Input
                type="text"
                placeholder="Environment"
                value={newConfig.environment || ''}
                onChange={(e) => onConfigChange(type, 'environment', e.target.value)}
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
                disabled={!canEdit || isConnecting}
              />
              <Input
                type="text"
                placeholder="Index Name"
                value={newConfig.index_name || ''}
                onChange={(e) => onConfigChange(type, 'index_name', e.target.value)}
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
                disabled={!canEdit || isConnecting}
              />
            </>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button 
              onClick={handleSaveClick}
              className="flex-1 min-w-0 admin-primary-button group"
              disabled={isConnecting || !canEdit || configStatus === 'validating'}
            >
              {configStatus === 'validating' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Validating...
                </span>
              ) : configStatus === 'success' ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-green-300" />
                  Saved
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Save Configuration
                </span>
              )}
            </Button>
            
            {canDelete && (
              <Button 
                variant="destructive"
                size="icon"
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
                disabled={isConnecting || !selectedConfig}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <AdminCardFooter className="pt-2 border-t border-[#8B5CF6]/20">
          <p className="text-sm text-muted-foreground flex items-center">
            <span>Get your API key from the</span>
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B5CF6] hover:text-[#D946EF] transition-colors ml-1 inline-flex items-center group"
            >
              {docsText}
              <ExternalLink className="h-3 w-3 ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </p>
        </AdminCardFooter>
      </AdminCardContent>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent rounded-bl-full pointer-events-none" />
      
      {configStatus === 'success' && (
        <div className="absolute top-4 right-4 bg-green-500/20 p-1.5 rounded-full border border-green-500/30">
          <Check className="h-4 w-4 text-green-500" />
        </div>
      )}
      
      {configStatus === 'error' && (
        <div className="absolute top-4 right-4 bg-red-500/20 p-1.5 rounded-full border border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-500" />
        </div>
      )}
    </AdminCard>
  );
}
