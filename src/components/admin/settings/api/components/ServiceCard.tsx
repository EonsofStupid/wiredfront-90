
import { AdminCard, AdminCardHeader, AdminCardTitle, AdminCardDescription, AdminCardContent, AdminCardFooter } from "@/components/admin/ui/AdminCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import { ServiceCardProps } from "@/types/admin/settings/api-configuration";

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
  return (
    <AdminCard className="relative overflow-hidden">
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
            onChange={(e) => onConfigChange(type, 'name', e.target.value)}
            className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 mb-2"
          />
          <Input
            type="password"
            placeholder={placeholder}
            value={newConfig.key}
            onChange={(e) => onConfigChange(type, 'key', e.target.value)}
            className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
          />
          {type === 'pinecone' && (
            <>
              <Input
                type="text"
                placeholder="Environment"
                value={newConfig.environment || ''}
                onChange={(e) => onConfigChange(type, 'environment', e.target.value)}
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
              />
              <Input
                type="text"
                placeholder="Index Name"
                value={newConfig.index_name || ''}
                onChange={(e) => onConfigChange(type, 'index_name', e.target.value)}
                className="bg-dark/30 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50"
              />
            </>
          )}
          <Button 
            onClick={() => onSaveConfig(type, newConfig)}
            className="w-full admin-primary-button group mt-2"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4 transition-transform group-hover:scale-110" />
                Add Configuration
              </span>
            )}
          </Button>
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
    </AdminCard>
  );
}
