import { useState } from "react";
import { useAPIConfigurations } from "@/hooks/admin/settings/useAPIConfigurations";
import { APIType } from "@/types/admin/settings/api-configuration";
import { toast } from "sonner";
import { VECTOR_DB_CONFIGURATIONS } from "@/constants/api-configurations";
import { ServiceCard } from "./components/ServiceCard";

export function RAGKeysSettings() {
  const { createConfiguration } = useAPIConfigurations();

  const handleSaveConfig = async (type: APIType) => {
    try {
      await createConfiguration(type);
      toast.success(`${type} configuration saved successfully`);
    } catch (error) {
      console.error(`Error saving ${type} configuration:`, error);
      toast.error(`Failed to save ${type} configuration`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Vector Database Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your vector database connections for RAG capabilities.
        </p>
      </div>

      <div className="grid gap-6">
        {VECTOR_DB_CONFIGURATIONS.map((config) => (
          <ServiceCard
            key={config.type}
            type={config.type}
            title={config.label}
            description={config.description}
            docsUrl={config.docsUrl}
            docsText={config.docsText}
            placeholder={config.placeholder}
            onSaveConfig={handleSaveConfig}
          />
        ))}
      </div>
    </div>
  );
}